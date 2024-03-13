from flask import Flask, jsonify, request, session, redirect, url_for
from flask_cors import CORS, cross_origin
from db import *
from img_upload import *
from event_utils import EventUtils
from mapBox import MapBox
from flask_session import Session
from flask_login import LoginManager

app = Flask(__name__)

secret_key = os.environ.get("SECRET_KEY")
app.secret_key = secret_key

app.config['SECRET_KEY'] = secret_key
app.config['SESSION_TYPE'] = 'filesystem'
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True

login_manager = LoginManager()
login_manager.init_app(app)

event_utils = EventUtils()
mapbox = MapBox()
Session(app)
CORS(app, supports_credentials = True)

@app.route("/")
def home():
    return "<p>Hello, World!</p>"

@app.route('/events', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_all_events_route():
    # print("SESHHHH", session)
    events = get_all_events()
    if session.get('user_id'):
        user = get_user_by_id(session['user_id'])
        user_events = event_utils.filter_events(events, user)

    else:
        for event in events:
            event['eventImgId'] = str(event.get('eventImgId'))
            event['_id'] = str(event.get('_id'))
        user_events = events

    return jsonify(user_events), 200

@app.route('/addEvent', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_event():
    if 'eventImage' not in request.files:
        return jsonify({'error': 'No file part'})
    
    id = session["user_id"]
    data = {}
    data["eventName"] = request.form.get('eventName')
    data["eventDescription"] = request.form.get('eventDescription')
    data["eventLocation"] = request.form.get('eventLocation')
    data["selectedVisibility"] = request.form.get('selectedVisibility')
    data["author"] = id
    eventLocation = request.form.get('eventLocation')
    geolocation = mapbox.geocode(eventLocation)
    data["geometry"] = geolocation['features'][0]['geometry']['coordinates']

    file = request.files['eventImage']
    src = upload_img(file)
    image_id = create_image(src)
    data['eventImgId'] = image_id

    inserted_id = create_event(data, id)
    return jsonify({'success': True, 'inserted_id': str(inserted_id)}), 200

@app.route('/image/<img_id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_event_img(img_id):
    img = get_img_by_id(img_id)
    return jsonify({'result': img['url']})

@app.route('/events/<event_id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_event_route(event_id):
    event = get_event_by_id(event_id)
    event['_id'] = str(event['_id'])
    event['eventImgId'] = str(event.get('eventImgId'))
    if event:
        return jsonify(event), 200
    else:
        return jsonify({'error': 'Event not found'}), 404

@app.route('/events/<event_id>', methods=['DELETE'])
def delete_event_route(event_id):
    img_id = request.args.get('imgId') 
    try:
        img_Obj = get_img_by_id(img_id)
        res = delete_img(img_Obj["public_id"])
        delete_result = delete_event(event_id, img_id)

        if delete_result.deleted_count == 1 and res['result'] == 'ok':
            return jsonify({'success': True, 'message': 'Event deleted successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'Event not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/signUp', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    school = data.get('school')
    first_name = data.get('firstName')
    last_name = data.get('lastName')

    user_name = {"fName" : first_name,
                 "lName" : last_name}

    # Check if the email already exists
    if get_user_by_email(email):
        return jsonify(error='Email already exists'), 409

    # Create a new user
    user_id = create_user(email, password, school, first_name, last_name)
    # Check if user creation was successful
    if user_id:
        session['user_id'] = user_id
        return jsonify(message='User registered successfully', user  = user_name), 201
    else:
        return jsonify(error='Failed to create user'), 500

@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists
    user = get_user_by_email(email)
    if not user:
        return jsonify(error='User not found'), 404

    # Check if the password is correct
    if not check_password(user['password'], password):
        return jsonify(error='Invalid password'), 401
    user_name = {"fName" : user["first_name"],
                 "lName" : user["last_name"]}

    session['user_id'] = str(user['_id'])
    return jsonify(message= session.get("user_id"), user = user_name), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify(message='Logged out successfully'), 200

@app.route("/user_sess")
@cross_origin(supports_credentials=True)
def user():
    if session.get("user_id"):
        return jsonify({"user_in_session": True, "user_id": session["user_id"]})
    else:
        return jsonify({"user_in_session": False})
    
@app.route("/user/validate")
@cross_origin(supports_credentials=True)
def validate():
    if 'user_id' in session:
        return "True"
    return "False"

@app.route("/validate/<author>", methods=['GET'])
@cross_origin(supports_credentials=True)
def check_author(author):
    if author == session['user_id']:
        return jsonify({'result': True})
    return jsonify({'result': False})

def validate_owner(user_id):
    res = get_user_by_id(user_id)
    return res['_id'] == user_id

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)