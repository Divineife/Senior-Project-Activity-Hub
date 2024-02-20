from flask import Flask, jsonify, request, session
from flask_cors import CORS
from db import *

app = Flask(__name__)
CORS(app, supports_credentials = True)


@app.route("/")
def home():
    return "<p>Hello, World!</p>"

@app.route('/events', methods=['GET'])
def get_all_events_route():
    events = get_all_events()
    for event in events:
        event['_id'] = str(event['_id'])
    return jsonify(events), 200

@app.route('/addEvent', methods=['POST'])
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
    print("DATA IS ", data)

    # Check if the email already exists
    if get_user_by_email(email):
        return jsonify(error='Email already exists'), 409

    # Create a new user
    create_user(email, password, school, first_name, last_name)
    return jsonify(message='User registered successfully'), 201

@app.route('/login', methods=['POST'])
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

    # Store the user's ID in the session
    session['user_id'] = user['_id']

    return jsonify(message='Logged in successfully'), 200

@app.route('/logout', methods=['POST'])
def logout():
    # Your logout logic here
    session.pop('user_id', None)
    return jsonify(message='Logged out successfully'), 200


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)