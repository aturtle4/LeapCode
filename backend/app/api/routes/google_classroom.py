from fastapi import APIRouter, Depends, HTTPException, status, Response
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
import json
import logging

from app.core.config import settings
from app.db.database import get_db
from app.models.skill_tree import SkillTree
from app.schemas.skill_tree import SkillTreeClassroomLink, SkillTreeResponse
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.google_classroom import GoogleClassroomService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/list")
async def list_google_classrooms(
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all Google Classrooms accessible to the authenticated user
    """
    # For CORS preflight requests
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

    # Check if user has google_token attribute and it's not None
    has_token = False
    try:
        has_token = (
            hasattr(current_user, "google_token")
            and current_user.google_token is not None
        )
    except:
        logger.warning("Failed to check google_token attribute on user")

    if not has_token:
        # Use mock data since user doesn't have a Google token
        logger.info(
            f"User {current_user.id} doesn't have a Google token, using mock data"
        )
        return GoogleClassroomService.get_mock_classrooms()

    try:
        # Parse the stored token
        token = json.loads(current_user.google_token)
        logger.info(f"Attempting to list classrooms for user {current_user.id}")

        # Use the Google Classroom service to list classrooms
        classrooms = GoogleClassroomService.list_classrooms(token)
        logger.info(f"Successfully retrieved {len(classrooms)} classrooms")
        return classrooms
    except Exception as e:
        logger.error(f"Error in list_google_classrooms: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Google Classrooms: {str(e)}",
        )


@router.get("/{classroom_id}")
async def get_google_classroom(
    classroom_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get details for a specific Google Classroom
    """
    # Get the user's Google OAuth token from the database
    if not current_user.google_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account not connected. Please sign in with Google.",
        )

    try:
        # Parse the stored token
        token = json.loads(current_user.google_token)
        # Use the Google Classroom service to get classroom details
        classroom = GoogleClassroomService.get_classroom(token, classroom_id)

        if not classroom:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Classroom with ID {classroom_id} not found",
            )

        return classroom
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Google Classroom: {str(e)}",
        )


@router.post("/link")
async def link_skill_tree_to_classroom(
    link_data: SkillTreeClassroomLink,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Link a skill tree to a Google Classroom
    """
    # Get the skill tree
    skill_tree = (
        db.query(SkillTree).filter(SkillTree.id == link_data.skill_tree_id).first()
    )
    if not skill_tree:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill tree with ID {link_data.skill_tree_id} not found",
        )

    # Get the user's Google OAuth token from the database
    if not current_user.google_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account not connected. Please sign in with Google.",
        )

    try:
        # Parse the stored token
        token = json.loads(current_user.google_token)
        # Verify the classroom exists
        classroom = GoogleClassroomService.get_classroom(token, link_data.classroom_id)

        if not classroom:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Classroom with ID {link_data.classroom_id} not found",
            )

        # Update the skill tree with classroom information
        skill_tree.classroom_id = classroom["id"]
        skill_tree.classroom_name = classroom["name"]
        skill_tree.classroom_url = classroom["url"]

        db.commit()
        db.refresh(skill_tree)

        return {
            "message": "Skill tree linked to classroom successfully",
            "skill_tree_id": skill_tree.id,
            "classroom_id": skill_tree.classroom_id,
            "classroom_name": skill_tree.classroom_name,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to link skill tree to classroom: {str(e)}",
        )


@router.get("/skill-tree/{skill_tree_id}")
async def get_classroom_for_skill_tree(
    skill_tree_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get the Google Classroom associated with a skill tree
    """
    skill_tree = db.query(SkillTree).filter(SkillTree.id == skill_tree_id).first()
    if not skill_tree:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill tree with ID {skill_tree_id} not found",
        )

    if not skill_tree.classroom_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No classroom associated with skill tree {skill_tree_id}",
        )

    # Simply return the stored classroom information
    # No need to call the Google API for this
    return {
        "id": skill_tree.classroom_id,
        "name": skill_tree.classroom_name,
        "url": skill_tree.classroom_url,
    }


@router.delete("/skill-tree/{skill_tree_id}/link")
async def unlink_skill_tree_from_classroom(
    skill_tree_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Remove the Google Classroom association from a skill tree
    """
    skill_tree = db.query(SkillTree).filter(SkillTree.id == skill_tree_id).first()
    if not skill_tree:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill tree with ID {skill_tree_id} not found",
        )

    if not skill_tree.classroom_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Skill tree {skill_tree_id} is not linked to any classroom",
        )

    # Remove the classroom association
    classroom_name = skill_tree.classroom_name  # Store for the response
    skill_tree.classroom_id = None
    skill_tree.classroom_name = None
    skill_tree.classroom_url = None

    db.commit()

    return {
        "message": f"Skill tree unlinked from classroom successfully",
        "skill_tree_id": skill_tree.id,
        "previous_classroom_name": classroom_name,
    }


@router.get("/auth")
async def get_google_classroom_auth_url(current_user: User = Depends(get_current_user)):
    """
    Get Google Classroom OAuth URL for authorization
    """
    # Since you're already using Google OAuth for authentication,
    # we don't need to create a new authorization flow.
    # We just need to ensure we have the correct scopes.

    # Return a message to the user about using their existing credentials
    return {
        "message": "Your existing Google account credentials will be used to access Google Classroom.",
        "status": "authenticated" if current_user.google_token else "not_authenticated",
    }
