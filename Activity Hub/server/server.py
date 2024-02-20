from flask import Flask, jsonify, request
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
    print("HERE")
    print("ID GOTTEN IS", event_id)
    delete_result = delete_event(event_id)

    if delete_result.deleted_count == 1:
        return jsonify({'success': True, 'message': 'Event deleted successfully'}), 200
    else:
        return jsonify({'success': False, 'message': 'Event not found'}), 404


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)