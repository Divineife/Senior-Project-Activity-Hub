from flask import Flask, jsonify, request, session, redirect, url_for
from flask_cors import CORS, cross_origin
from db import *
from flask_session import Session


app = Flask(__name__)


secret_key = os.environ.get("SECRET_KEY")
app.secret_key = secret_key

app.config['SECRET_KEY'] = secret_key
app.config['SESSION_TYPE'] = 'filesystem'
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)

Session(app)
CORS(app, supports_credentials = True)

@app.route("/")
def home():
    return "<p>Hello, World!</p>"

@app.route('/events', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_all_events_route():
    print("SESHHHH", session, session.sid)
    events = get_all_events()
    for event in events:
        event['_id'] = str(event['_id'])
    return jsonify(events), 200

@app.route('/addEvent', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_event():
    response = jsonify(message="Simple server is running")
    data = request.json
    inserted_id = create_event(data)
    return jsonify({'success': True, 'inserted_id': str(inserted_id)}), 200



@app.route('/events/<event_id>', methods=['GET'])
def get_event_route(event_id):
    event = get_event_by_id(event_id)
    event['_id'] = str(event['_id'])
    
    if event:
        return jsonify(event), 200
    else:
        return jsonify({'error': 'Event not found'}), 404

@app.route('/events/<event_id>', methods=['DELETE'])
def delete_event_route(event_id):
    delete_result = delete_event(event_id)

    if delete_result.deleted_count == 1:
        return jsonify({'success': True, 'message': 'Event deleted successfully'}), 200
    else:
        return jsonify({'success': False, 'message': 'Event not found'}), 404

@app.route('/signUp', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    school = data.get('school')
    first_name = data.get('firstName')
    last_name = data.get('lastName')

    # Check if the email already exists
    if get_user_by_email(email):
        return jsonify(error='Email already exists'), 409

    # Create a new user
    create_user(email, password, school, first_name, last_name)
    return jsonify(message='User registered successfully'), 201

@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.json
    # Your login logic here
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists
    user = get_user_by_email(email)
    if not user:
        return jsonify(error='User not found'), 404

    # Check if the password is correct
    if not check_password(user['password'], password):
        return jsonify(error='Invalid password'), 401

    session['user_id'] = str(user['_id'])
    print("LOGIN", session, session.sid)
    return jsonify(message='Logged in successfully'), 200

@app.route('/logout', methods=['POST'])
def logout():
    # Your logout logic here
    session.pop('user_id', None)
    return jsonify(message='Logged out successfully'), 200


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)