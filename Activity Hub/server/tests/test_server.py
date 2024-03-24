import json
from unittest.mock import patch
import pytest
from flask import session
from ..myServer.app import app
from ..myServer.db import *
from unittest.mock import MagicMock

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_home_route(client):
    response = client.get('/')
    assert b"Hello, World!" in response.data

def test_get_all_events_route(client):
    session_mock = MagicMock()
    session_mock.__getitem__.return_value = 'mock_user_id'

    mock_user = {'_id': "mock_user_id", 'school': 'Mock School'}

    mock_events = [
        {'_id': '1', 'eventImgId': '1', 'selectedVisibility': 'Mock School,Other School'},
        {'_id': '2', 'eventImgId': '2', 'selectedVisibility': 'Another School'}
    ]
    filtered_events = [{'_id': '1', 'eventImgId': '1', 'selectedVisibility': 'Mock School,Other School'}]

    with patch('server.myServer.app.session', session_mock):
        with patch('server.myServer.db.get_all_events', return_value=mock_events) as mock_get_all_events:
            with patch('server.myServer.db.get_user_by_id', return_value = mock_user) as mock_get_user_by_id:
                with patch('server.myServer.event_utils.filter_events', return_value=filtered_events) as mock_filter_events:
                    with app.test_client() as client:
                        response = client.get('/events')
                        data = response.data
                        if not isinstance(data, list):
                            data = json.loads(data.decode('utf-8'))
                        assert response.status_code == 200
                        assert {'_id': '2', 'eventImgId': '2', 'selectedVisibility': 'Another School'} not in data
                        assert {'_id': '1', 'eventImgId': '1', 'selectedVisibility': 'Mock School,Other School'} in data
    
    mock_get_all_events.assert_called_once()
    mock_get_user_by_id.assert_called_with('mock_user_id')
    mock_filter_events.assert_called_once_with(mock_events, mock_user)

def test_get_all_events_route_no_session(client):
    session_mock = {}
    mock_events = [
        {'_id': 1, 'eventImgId': 1, 'selectedVisibility': 'Mock School,Other School'},
        {'_id': 2, 'eventImgId': 2, 'selectedVisibility': 'Another School'}
    ]
    with patch('server.myServer.app.session', session_mock):
        with patch('server.myServer.db.get_all_events', return_value=mock_events) as mock_get_all_events:
            response = client.get('/events')
            assert response.status_code == 200
            assert len(response.json) == 2
    
    mock_get_all_events.assert_called_once()