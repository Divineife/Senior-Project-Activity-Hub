import os, requests
from flask import request
from dotenv import load_dotenv, find_dotenv

load_dotenv()
MAPBOX_ACCESS_TOKEN = os.environ.get("MAPBOX_TOKEN")


def geocode(query):
    url = f'https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?access_token={MAPBOX_ACCESS_TOKEN}&limit= {1}'
    response = requests.get(url)
    data = response.json()
    return data