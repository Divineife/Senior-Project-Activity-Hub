import cloudinary
import os
from dotenv import load_dotenv, find_dotenv
import cloudinary.uploader
import cloudinary.api


class ImageManager:
    def __init__(self):
        # Load environment variables
        load_dotenv(find_dotenv("API_SECRET"))

        # Set Cloudinary configuration from environment variables
        self.api_secret = os.environ.get("API_SECRET")
        self.cloud_name = os.environ.get("CLOUD_NAME")
        self.api_key = os.environ.get("API_KEY")

        # Configure Cloudinary globally
        cloudinary.config(
            cloud_name=self.cloud_name,
            api_key=self.api_key,
            api_secret=self.api_secret,
            secure=True,
        )

    def upload_img(self, file):
        print(file)
        # Upload the image to Cloudinary
        res = cloudinary.uploader.upload(file, overwrite=True)
        del res["api_key"]  # Remove sensitive data from the response
        return res

    def delete_img(self, pid):
        # Delete the image from Cloudinary using its public ID
        res = cloudinary.uploader.destroy(pid)
        return res
