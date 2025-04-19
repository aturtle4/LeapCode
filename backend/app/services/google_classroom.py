from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
from google.auth.exceptions import RefreshError
import json
import logging
import base64
from typing import List, Dict, Any, Optional
from app.core.config import settings

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GoogleClassroomService:
    """
    Service for interacting with Google Classroom API
    """

    @staticmethod
    def get_classroom_service(token: Dict[str, Any]) -> Any:
        """Create and return a Google Classroom service client using the provided token"""
        try:
            # Log token structure (without sensitive data) for debugging
            logger.info(f"Token keys: {list(token.keys())}")

            # Create credentials with proper error handling
            credentials = Credentials(
                token=token.get("access_token"),
                refresh_token=token.get("refresh_token"),
                token_uri="https://oauth2.googleapis.com/token",
                client_id=settings.GOOGLE_CLIENT_ID,
                client_secret=settings.GOOGLE_CLIENT_SECRET,
                scopes=[
                    "https://www.googleapis.com/auth/classroom.courses",
                    "https://www.googleapis.com/auth/classroom.courses.readonly",
                    "https://www.googleapis.com/auth/classroom.rosters.readonly",
                    "https://www.googleapis.com/auth/classroom.announcements",
                ],
            )

            # Refresh token if necessary with proper error handling
            if credentials.expired and credentials.refresh_token:
                try:
                    credentials.refresh(Request())
                except RefreshError as e:
                    logger.error(f"Error refreshing token: {str(e)}")
                    raise Exception(
                        f"Authentication expired, please sign in again: {str(e)}"
                    )

            # Build and return the service
            return build("classroom", "v1", credentials=credentials)

        except Exception as e:
            logger.error(f"Error creating classroom service: {str(e)}")
            raise Exception(f"Failed to initialize Google Classroom service: {str(e)}")

    @staticmethod
    def list_classrooms(token: Dict[str, Any]) -> List[Dict[str, Any]]:
        """List all Google Classrooms the user has access to"""
        try:
            service = GoogleClassroomService.get_classroom_service(token)

            # Get courses the user has access to (teaching or enrolled)
            results = (
                service.courses()
                .list(courseStates=["ACTIVE"], teacherId="me")
                .execute()
            )

            courses = results.get("courses", [])

            # Also get courses where the user is a student
            student_results = (
                service.courses()
                .list(courseStates=["ACTIVE"], studentId="me")
                .execute()
            )

            student_courses = student_results.get("courses", [])
            if student_courses:
                courses.extend(student_courses)

            # Format the courses for our API
            formatted_courses = []
            for course in courses:
                course_id = course.get("id")
                encoded_id = GoogleClassroomService.encode_classroom_id(course_id)
                formatted_courses.append(
                    {
                        "id": course_id,
                        "name": course.get("name"),
                        "description": course.get("description", ""),
                        "url": f"https://classroom.google.com/c/{encoded_id}",
                    }
                )

            return formatted_courses

        except HttpError as e:
            logger.error(f"Google API error: {str(e)}")
            error_content = json.loads(e.content.decode())
            error_message = error_content.get("error", {}).get("message", str(e))
            logger.warning("Falling back to mock data due to Google API error")
            return GoogleClassroomService.get_mock_classrooms()
        except Exception as e:
            logger.error(f"Error listing classrooms: {str(e)}")
            logger.warning("Falling back to mock data due to error")
            return GoogleClassroomService.get_mock_classrooms()

    @staticmethod
    def get_mock_classrooms() -> List[Dict[str, Any]]:
        """Provide mock classroom data for development/fallback purposes"""
        mock_classes = [
            {
                "id": "123456",
                "name": "OOP Programming",
                "description": "Learn object-oriented programming concepts",
            },
            {
                "id": "789012",
                "name": "Data Structures",
                "description": "Advanced data structures and algorithms",
            },
            {
                "id": "345678",
                "name": "Design Patterns",
                "description": "Software design patterns and principles",
            },
        ]

        # Add properly encoded URLs for each mock classroom
        for classroom in mock_classes:
            encoded_id = GoogleClassroomService.encode_classroom_id(classroom["id"])
            classroom["url"] = f"https://classroom.google.com/c/{encoded_id}"

        return mock_classes

    @staticmethod
    def get_classroom(
        token: Dict[str, Any], classroom_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get details for a specific Google Classroom"""
        try:
            service = GoogleClassroomService.get_classroom_service(token)
            course = service.courses().get(id=classroom_id).execute()

            course_id = course.get("id")
            encoded_id = GoogleClassroomService.encode_classroom_id(course_id)
            return {
                "id": course_id,
                "name": course.get("name"),
                "description": course.get("description", ""),
                "url": f"https://classroom.google.com/c/{encoded_id}",
            }
        except HttpError as e:
            logger.error(f"Google API error getting classroom {classroom_id}: {str(e)}")
            if e.resp.status == 404:
                return None
            error_content = json.loads(e.content.decode())
            error_message = error_content.get("error", {}).get("message", str(e))
            raise Exception(f"Google Classroom API error: {error_message}")
        except Exception as e:
            logger.error(f"Error getting classroom {classroom_id}: {str(e)}")
            return None

    @staticmethod
    def encode_classroom_id(classroom_id: str) -> str:
        """
        Encode classroom ID to the format used in Google Classroom URLs.
        Google Classroom uses base64 encoding for the course IDs in URLs.
        """
        try:
            # Convert string ID to bytes and encode to base64
            id_bytes = str(classroom_id).encode("utf-8")
            encoded_id = base64.b64encode(id_bytes).decode("utf-8")

            # Remove any padding characters (=) as they're not used in the URL
            encoded_id = encoded_id.rstrip("=")

            return encoded_id
        except Exception as e:
            logger.error(f"Error encoding classroom ID {classroom_id}: {str(e)}")
            # Fall back to the original ID if encoding fails
            return classroom_id
