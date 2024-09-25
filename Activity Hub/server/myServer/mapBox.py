import os
import requests
from dotenv import load_dotenv, find_dotenv


class Geocoder:
    def __init__(self):
        # Load environment variables and get the Mapbox access token
        load_dotenv(find_dotenv())
        self.mapbox_access_token = os.environ.get("MAPBOX_TOKEN")

    def geocode(self, query):
        # Create the URL and make a request to the Mapbox geocoding API
        url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?access_token={self.mapbox_access_token}&limit=1"
        response = requests.get(url)
        data = response.json()
        return data
