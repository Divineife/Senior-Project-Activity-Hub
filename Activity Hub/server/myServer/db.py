from bson import ObjectId
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
from flask_bcrypt import Bcrypt
import os

# Load environment variables
load_dotenv(find_dotenv())

# Get MongoDB password from environment variables
password = os.environ.get("MONGODB_PWD")

# MongoDB connection string
connection_string = f"mongodb+srv://divvy:{password}@activityhub.zg8lxw8.mongodb.net/?retryWrites=true&w=majority"


# Create a MongoClient instance
client = MongoClient(connection_string, tlsCAFile=certifi.where())
bcrypt = Bcrypt()

# create the event database
event = client.event
event_instance = event.event_collections

# create the user database
user = client.user
user_instance = user.user_collections

image = client.image
image_instance = image.image_collections


def get_all_events():
    try:
        # Connect to the database and retrieve all events from the collection
        events = list(event_instance.find())
        return events
    except Exception as e:
        print(f"An error occurred: {e}")
        raise


def create_image(data):
    result = image_instance.insert_one(data)
    return result.inserted_id


def get_img_by_id(img_id):
    image = image_instance.find_one({"_id": ObjectId(img_id)})
    return image


def get_event_by_id(event_id):
    # Connect to the database and retrieve the event from the collection
    print("GOT", event_id)
    event = event_instance.find_one({"_id": ObjectId(event_id)})

    return event


# Define a function to create event documents in the database
def create_event(data, id):
    result = event_instance.insert_one(data)

    user = user_instance.find_one({"_id": ObjectId(id)})
    if user:
        user_instance.update_one(
            {"_id": ObjectId(id)}, {"$push": {"events": result.inserted_id}}
        )
    return result.inserted_id


def update_event(event_id, data):
    result = event_instance.update_one({"_id": ObjectId(event_id)}, {"$set": data})
    return result.modified_count


def rsvp(event_id, user_id):
    event_instance.update_one(
        {"_id": ObjectId(event_id)}, {"$push": {"rsvpUsers": user_id}}
    )


def unrsvp(event_id, user_id):
    event_instance.update_one(
        {"_id": ObjectId(event_id)}, {"$pull": {"rsvpUsers": user_id}}
    )


def event_exists(event_id):
    event_count = event_instance.count_documents({"_id": ObjectId(event_id)})
    return event_count > 0


def delete_event(event_id, img_id):
    # Connect to the database and delete the event from the collection
    try:
        val = delete_img(img_id)
        delete_result = event_instance.delete_one({"_id": ObjectId(event_id)})
    finally:
        return delete_result


def delete_img(img_id):
    delete_res = image_instance.delete_one({"_id": ObjectId(img_id)})
    return delete_res


def get_user_by_email(email):
    user = user_instance.find_one({"email": email})
    return user


def create_user(email, password, school, first_name, last_name):
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create the user document
    user = {
        "email": email,
        "password": hashed_password,
        "school": school,
        "first_name": first_name,
        "last_name": last_name,
    }
    # Insert the user document into the database
    result = user_instance.insert_one(user)
    return result.inserted_id


def check_password(hashed_password, password):
    return bcrypt.check_password_hash(hashed_password, password)


def get_user_by_id(user_id):
    res = user_instance.find_one({"_id": ObjectId(user_id)})
    return res
