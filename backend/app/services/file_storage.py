import os
import requests
import logging
import uuid
import shutil
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class FileStorageService:
    """
    Service for handling file storage operations, particularly profile images
    """

    def __init__(self, base_dir: str = "app/static"):
        self.base_dir = base_dir
        self.profile_images_dir = os.path.join(self.base_dir, "profile_images")

        # Ensure directories exist
        os.makedirs(self.profile_images_dir, exist_ok=True)

        logger.info(
            f"FileStorageService initialized with base directory: {self.base_dir}"
        )

    def download_profile_image(self, image_url: str, user_id: str) -> Optional[str]:
        """
        Download a profile image from the given URL and save it to the local filesystem

        Args:
            image_url: URL of the image to download
            user_id: User ID to associate with the image

        Returns:
            The local path to the saved image, or None if download failed
        """
        if not image_url:
            logger.warning(f"No image URL provided for user {user_id}")
            return None

        try:
            # Generate a filename based on user_id to ensure uniqueness
            # Use .jpg extension as most profile pics are JPEGs, but this could be improved
            # with content-type detection
            filename = f"{user_id}.jpg"
            filepath = os.path.join(self.profile_images_dir, filename)

            # Make the request to download the image
            response = requests.get(image_url, stream=True, timeout=10)
            response.raise_for_status()  # Raise an exception for HTTP errors

            # Save the image to disk
            with open(filepath, "wb") as f:
                response.raw.decode_content = True
                shutil.copyfileobj(response.raw, f)

            logger.info(f"Successfully downloaded profile image for user {user_id}")

            # Return the relative path for URL construction
            return f"profile_images/{filename}"

        except Exception as e:
            logger.error(
                f"Failed to download profile image for user {user_id}: {str(e)}"
            )
            return None

    def get_profile_image_path(self, user_id: str) -> Optional[str]:
        """
        Get the path to a user's profile image if it exists

        Args:
            user_id: User ID to get the profile image for

        Returns:
            The relative path to the profile image, or None if it doesn't exist
        """
        filename = f"{user_id}.jpg"
        filepath = os.path.join(self.profile_images_dir, filename)

        if os.path.exists(filepath):
            return f"profile_images/{filename}"

        return None


# Create a singleton instance
file_storage_service = FileStorageService()
