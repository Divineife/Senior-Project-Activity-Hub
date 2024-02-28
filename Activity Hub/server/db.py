from bson import ObjectId
import certifi
from pymongo import MongoClient       
from dotenv import load_dotenv, find_dotenv
from flask_bcrypt import Bcrypt
import os
import pprint

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

def get_all_events():
    try:
        # Connect to the database and retrieve all events from the collection
        events = list(event_instance.find())
        return events
    except Exception as e:
        print(f"An error occurred: {e}")
        raise


# Define a function to create event documents in the database
def create_event(data):
    result = event_instance.insert_one(data)
    return result.inserted_id

def get_event_by_id(event_id):
    # Connect to the database and retrieve the event from the collection
    event = event_instance.find_one({'_id': ObjectId(event_id)})

    return event

def delete_event(event_id):
    # Connect to the database and delete the event from the collection
    delete_result = event_instance.delete_one({'_id': ObjectId(event_id)})
    return delete_result

def get_user_by_email(email):
    user = user_instance.find_one({"email": email})
    return user

def create_user(email, password, school, first_name, last_name):
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create the user document
    user = {
        "email": email,
        "password": hashed_password,
        "school": school,
        "first_name": first_name,
        "last_name": last_name
    }
    # Insert the user document into the database
    result = user_instance.insert_one(user)
    return result.inserted_id

def check_password(hashed_password, password):
    return bcrypt.check_password_hash(hashed_password, password)