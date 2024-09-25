from bson import ObjectId
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
from flask_bcrypt import Bcrypt
import os


class Database:
    def __init__(self):
        # Load environment variables
        load_dotenv(find_dotenv())

        # Get MongoDB password from environment variables
        password = os.environ.get("MONGODB_PWD")

        # MongoDB connection string
        connection_string = f"mongodb+srv://divvy:{password}@activityhub.zg8lxw8.mongodb.net/?retryWrites=true&w=majority"

        # Create a MongoClient instance
        self.client = MongoClient(connection_string, tlsCAFile=certifi.where())
        self.bcrypt = Bcrypt()

        # Create event, user, and image collections
        self.event_instance = self.client.event.event_collections
        self.user_instance = self.client.user.user_collections
        self.image_instance = self.client.image.image_collections

    def get_all_events(self):
        try:
            events = list(self.event_instance.find())
            return events
        except Exception as e:
            print(f"An error occurred: {e}")
            raise

    def create_image(self, data):
        result = self.image_instance.insert_one(data)
        return result.inserted_id

    def get_img_by_id(self, img_id):
        image = self.image_instance.find_one({"_id": ObjectId(img_id)})
        return image

    def get_event_by_id(self, event_id):
        event = self.event_instance.find_one({"_id": ObjectId(event_id)})
        return event

    def create_event(self, data, id):
        result = self.event_instance.insert_one(data)
        user = self.user_instance.find_one({"_id": ObjectId(id)})
        if user:
            self.user_instance.update_one(
                {"_id": ObjectId(id)}, {"$push": {"events": result.inserted_id}}
            )
        return result.inserted_id

    def update_event(self, event_id, data):
        result = self.event_instance.update_one(
            {"_id": ObjectId(event_id)}, {"$set": data}
        )
        return result.modified_count

    def rsvp(self, event_id, user_id):
        self.event_instance.update_one(
            {"_id": ObjectId(event_id)}, {"$push": {"rsvpUsers": str(user_id)}}
        )

    def unrsvp(self, event_id, user_id):
        self.event_instance.update_one(
            {"_id": ObjectId(event_id)}, {"$pull": {"rsvpUsers": ObjectId(user_id)}}
        )

    def event_exists(self, event_id):
        event_count = self.event_instance.count_documents({"_id": ObjectId(event_id)})
        return event_count > 0

    def delete_event(self, event_id, img_id):
        try:
            self.delete_img(img_id)
            delete_result = self.event_instance.delete_one({"_id": ObjectId(event_id)})
        finally:
            return delete_result

    def delete_img(self, img_id):
        delete_res = self.image_instance.delete_one({"_id": ObjectId(img_id)})
        return delete_res

    def get_user_by_email(self, email):
        user = self.user_instance.find_one({"email": email})
        return user

    def create_user(self, email, password, school, first_name, last_name):
        hashed_password = self.bcrypt.generate_password_hash(password).decode("utf-8")

        user = {
            "email": email,
            "password": hashed_password,
            "school": school,
            "first_name": first_name,
            "last_name": last_name,
        }
        result = self.user_instance.insert_one(user)
        return result.inserted_id

    def check_password(self, hashed_password, password):
        return self.bcrypt.check_password_hash(hashed_password, password)

    def get_user_by_id(self, user_id):
        res = self.user_instance.find_one({"_id": ObjectId(user_id)})
        return res
