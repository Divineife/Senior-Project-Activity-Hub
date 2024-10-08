import os
from flask import Flask, jsonify, request, session, redirect, url_for
from flask_cors import CORS, cross_origin
from db import Database
from img import ImageManager
from event_utils import EventUtils
from mapBox import Geocoder
from bson import ObjectId
from flask_session import Session
from flask_login import LoginManager

app = Flask(__name__)
db = Database()
img = ImageManager()
event_utils = EventUtils()
map_box = Geocoder()

secret_key = os.environ.get("SECRET_KEY")
app.secret_key = secret_key

app.config["SECRET_KEY"] = secret_key
app.config["SESSION_TYPE"] = "filesystem"
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_COOKIE_NAME"] = "your_desired_cookie_name"


login_manager = LoginManager()
login_manager.init_app(app)

Session(app)
CORS(app, supports_credentials=True)


@app.route("/")
def home():
    return jsonify({"message": "<p>Hello, World!</p>"})


@app.route("/events", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_all_events_route():
    events = db.get_all_events()
    if session.get("user_id"):
        user = db.get_user_by_id(session["user_id"])
        user_events = event_utils.filter_events(events, user)

    else:
        for event in events:
            event["eventImgId"] = str(event.get("eventImgId"))
            event["_id"] = str(event.get("_id"))
        user_events = events
    return jsonify(user_events), 200


@app.route("/addEvent", methods=["POST"])
@cross_origin(supports_credentials=True)
def add_event():
    if "eventImage" not in request.files:
        return jsonify({"error": "No file part"})

    id = session["user_id"]
    data = {}
    data["eventName"] = request.form.get("eventName")
    data["eventDescription"] = request.form.get("eventDescription")
    data["eventLocation"] = request.form.get("eventLocation")
    data["selectedVisibility"] = request.form.get("selectedVisibility")
    data["author"] = id
    data["rsvpUsers"] = []
    eventLocation = request.form.get("eventLocation")
    geolocation = map_box.geocode(eventLocation)
    data["geometry"] = geolocation["features"][0]["geometry"]["coordinates"]

    file = request.files["eventImage"]
    src = img.upload_img(file)
    image_id = db.create_image(src)
    data["eventImgId"] = image_id

    inserted_id = db.create_event(data, id)
    return jsonify({"success": True, "inserted_id": str(inserted_id)}), 200


@app.route("/editEvent/<event_id>", methods=["PUT"])
@cross_origin(supports_credentials=True)
def edit_event(event_id):
    if not db.event_exists(event_id):
        return jsonify({"error": "Event not found"}), 404

    # Extract data from the request
    data = {}
    data["eventName"] = request.form.get("eventName")
    data["eventDescription"] = request.form.get("eventDescription")
    data["eventLocation"] = request.form.get("eventLocation")
    data["selectedVisibility"] = request.form.get("selectedVisibility")
    data["eventImgId"] = request.form.get("curEventImage")

    eventLocation = request.form.get("eventLocation")
    geolocation = map_box.geocode(eventLocation)
    data["geometry"] = geolocation["features"][0]["geometry"]["coordinates"]

    if "newEventImg" in request.files:
        try:
            img_Obj = db.get_img_by_id(data["eventImgId"])
            res = img.delete_img(img_Obj["public_id"])
        except Exception as e:
            return jsonify({"errMessage": "Failure during deletion"}), 500

        file = request.files["newEventImg"]
        src = img.upload_img(file)
        image_id = db.create_image(src)
        data["eventImgId"] = image_id

    document_count = db.update_event(event_id, data)
    if document_count < 1:
        return jsonify({"err Message": "Failed to update collection"}), 500

    return jsonify({"success": True}), 200


@app.route("/image/<img_id>", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_event_img(img_id):
    img = db.get_img_by_id(img_id)
    return jsonify({"result": img["url"]})


@app.route("/events/<event_id>", methods=["GET"])
@cross_origin(supports_credentials=True)
def get_event_route(event_id):
    event = db.get_event_by_id(event_id)
    event["_id"] = str(event["_id"])
    event["eventImgId"] = str(event.get("eventImgId"))
    if event:
        return jsonify(event), 200
    else:
        return jsonify({"error": "Event not found"}), 404


@app.route("/events/<event_id>", methods=["DELETE"])
def delete_event_route(event_id):
    img_id = request.args.get("imgId")
    try:
        img_Obj = db.get_img_by_id(img_id)
        res = img.delete_img(img_Obj["public_id"])
        delete_result = db.delete_event(event_id, img_id)

        if delete_result.deleted_count == 1 and res["result"] == "ok":
            return (
                jsonify({"success": True, "message": "Event deleted successfully"}),
                200,
            )
        else:
            return jsonify({"success": False, "message": "Event not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route("/signUp", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    school = data.get("school")
    first_name = data.get("firstName")
    last_name = data.get("lastName")

    user_name = {"fName": first_name, "lName": last_name}

    # Check if the email already exists
    if db.get_user_by_email(email):
        return jsonify(error="Email already exists"), 409

    # Create a new user
    user_id = db.create_user(email, password, school, first_name, last_name)
    # Check if user creation was successful
    if user_id:
        session["user_id"] = user_id
        return (
            jsonify(
                message="User registered successfully", user_id=user_id, user=user_name
            ),
            201,
        )
    else:
        return jsonify(error="Failed to create user"), 500


@app.route("/login", methods=["POST"])
@cross_origin(supports_credentials=True)
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Check if the user exists
    user = db.get_user_by_email(email)
    if not user:
        return jsonify(error="User not found"), 404

    # Check if the password is correct
    if not db.check_password(user["password"], password):
        return jsonify(error="Invalid password"), 401
    user_name = {"fName": user["first_name"], "lName": user["last_name"]}

    session["user_id"] = str(user["_id"])
    return jsonify(user_id=session.get("user_id"), user=user_name), 200


@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify(message="Logged out successfully"), 200


@app.route("/user_sess")
@cross_origin(supports_credentials=True)
def user():
    if session.get("user_id"):
        return jsonify({"user_in_session": True, "user_id": session["user_id"]})
    else:
        return jsonify({"user_in_session": False})


@app.route("/user")
@cross_origin(supports_credentials=True)
def getUser():
    user_id = session.get("user_id")
    user = db.get_user_by_id(user_id)
    user["_id"] = str(user["_id"])
    events = []
    if user.get("events"):
        for event in user["events"]:
            events.append(str(event))
    user["events"] = events
    return jsonify({"user": user}), 200


@app.route("/user/validate")
@cross_origin(supports_credentials=True)
def validate():
    if "user_id" in session:
        return "True"
    return "False"


@app.route("/validate/<author>", methods=["GET"])
@cross_origin(supports_credentials=True)
def check_author(author):
    if author == session["user_id"]:
        return jsonify({"result": True})
    return jsonify({"result": False})


@app.route("/events/<event_id>/rsvp", methods=["POST", "DELETE"])
def update_rsvp(event_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    if request.method == "POST":
        rsvp_list = db.get_event_by_id(event_id).get("rsvpUsers")
        if not rsvp_list or user_id not in rsvp_list:
            db.rsvp(event_id, user_id)
    else:
        db.unrsvp(event_id, user_id)

    return jsonify({"messsage": "RSVP updated successfully"})


def validate_owner(user_id):
    res = db.get_user_by_id(user_id)
    return res["_id"] == user_id


@app.route("/data/<id>", methods=["GET"])
def get_data_by_id(id):
    try:
        # Fetch data from MongoDB based on ID
        data = db.get_user_by_id(id)
        del data["_id"]
        if data.get("events"):
            del data["events"]
        if data:
            return jsonify(data), 200  # Return data with status code 200 (OK)
        else:
            return (
                jsonify({"message": "No data found for this ID"}),
                404,
            )  # Return error message with status code 404 (Not Found)

    except Exception as e:
        return jsonify({"message": str(e)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=3000, debug=True)
