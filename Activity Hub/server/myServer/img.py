import cloudinary
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv("API_SECRET"))

api_secret = os.environ.get("API_SECRET")
cloud_name = os.environ.get("CLOUD_NAME")
api_key = os.environ.get("API_KEY")
          
cloudinary.config( 
  cloud_name = cloud_name, 
  api_key = api_key, 
  api_secret = api_secret,
  secure = True
)

#Must set config parameters globally before next two imports
import cloudinary.uploader
import cloudinary.api

def upload_img(file):
    print(file)
    res = cloudinary.uploader.upload(file, overwrite=True)
    del(res['api_key'])
    return res

def delete_img(pid):
    res = cloudinary.uploader.destroy(pid)
    return res