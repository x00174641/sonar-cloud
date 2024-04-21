import os
import requests
import json
from dotenv import load_dotenv
import configparser
import base64
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()
config = configparser.ConfigParser()
config.read("./user_config.ini")
username = config.get('CREDENTIALS','username')
password = config.get('CREDENTIALS','password')

def retrieve_id_token():
    url = 'https://iol8nh69uh.execute-api.us-east-1.amazonaws.com/prod/login'
    data = {
        "username": username,
        "password": password
    }
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(url, data=json.dumps(data), headers=headers)

    if response.status_code == 200:
        try:
            response_data = response.json()
            body_data = json.loads(response_data['body'])
            id_token = body_data.get('AuthenticationResult', {}).get('IdToken')
            if id_token:
                logger.info("Successfully Authenticated.... Retrieved IdToken!")
                return id_token
            else:
                logger.error("IdToken not found in the response.")
        except ValueError as e:
            logger.error(f"Error parsing JSON response: {e}")
    else:
        logger.error(f"Failed to retrieve token, status code: {response.status_code}")

def retrieve_access_token():
    url = 'https://iol8nh69uh.execute-api.us-east-1.amazonaws.com/prod/login'
    data = {
        "username": username,
        "password": password
    }
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(url, data=json.dumps(data), headers=headers)

    if response.status_code == 200:
        try:
            response_data = response.json()
            body_data = json.loads(response_data['body'])
            access_token = body_data.get('AuthenticationResult', {}).get('AccessToken')
            if access_token:
                logger.info("Successfully Authenticated.... Retrieved AccessToken!")
                logger.info(f"Logged in as {username}.")
                return access_token
            else:
                logger.error("AccessToken not found in the response.")
        except ValueError as e:
            logger.error(f"Error parsing JSON response: {e}")
    else:
        logger.error(f"Failed to retrieve token, status code: {response.status_code}")

def API_FETCH_USER_SETTINGS():
    url = 'https://api.clipr.solutions/user/settings'

    headers = {
        'Authorization': f'Bearer {retrieve_access_token()}',
    }

    response = requests.get(url, headers=headers)
    logger.info("Hot_Key Fetched: {}".format(response.json().get('clip_hotkey')))
    logger.info("Clip Interval To Trim: {} seconds".format(response.json().get('clip_interval')))
    logger.info("OBS Port Fetched: {}".format(response.json().get('obs_port')))

    return response.json()


def upload_video_to_s3(local_video_file_path, s3_key):
    local_video_file_path = local_video_file_path.replace('\\', '/')
    id_token = retrieve_id_token()
    
    with open(local_video_file_path, 'rb') as video_file:
        files = {
            'file_content': (s3_key, video_file, 'video/mp4'),
            'accessToken': (None, retrieve_access_token()),
            'file_name': (None, s3_key),
        }
        
        headers = {
            'clipr_auth_token': id_token
        }
        
        response = requests.post(
            "https://api.clipr.solutions/gateway/upload",
            files=files,
            headers=headers
        )
        
        try:
            response_data = response.json()
            print(response_data)
        except ValueError as e:
            logger.error("Error parsing JSON:", e)

def postPassword(password):
    url = "https://api.clipr.solutions/post_obs_password"

    headers = {
        'Authorization': f'Bearer {retrieve_access_token()}',
    }

    data = {
        "password": password
    }

    # Make the POST request
    response = requests.post(url, headers=headers, data=data)

    # Check the response
    if response.status_code == 200:
        logger.info("Password updated successfully")
    else:
        logger.error("Failed to update password:", response.text)