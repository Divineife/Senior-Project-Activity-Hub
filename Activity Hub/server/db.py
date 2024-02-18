from bson import ObjectId
import certifi
from pymongo import MongoClient       
from dotenv import load_dotenv, find_dotenv
import os
import pprint

# Load environment variables
load_dotenv(find_dotenv())

# Get MongoDB password from environment variables
password = os.environ.get("MONGODB_PWD")

# MongoDB connection string
connection_string = f"mongodb+srv://divvy:{password}@activityhub.zg8lxw8.mongodb.net/?retryWrites=true&w=majority/test"

# Create a MongoClient instance
client = MongoClient(connection_string, tlsCAFile=certifi.where())

# Get the test database
event = client.event
event_instance = event.event_collections

def get_all_events():
    # Connect to the database and retrieve all events from the collection
    events = list(event_instance.find())
    return events

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
