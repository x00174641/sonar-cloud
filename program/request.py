import os
import requests
import json
from dotenv import load_dotenv
import configparser
import base64

load_dotenv()
aws_access_key_id = os.getenv('ACCESS_KEY')
aws_secret_access_key = os.getenv('SECRET_KEY')
client_id = os.getenv('COGNITO_APP_CLIENT_ID')
region_name = 'us-east-1'
bucket_name = 'cliprbucket'
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
config = configparser.ConfigParser()
config.read("../config/user_config.ini")
print("Sections found:", config.sections())
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
                print("Successfully Authenticated.... Retrieved IdToken!")
                return id_token
            else:
                print("IdToken not found in the response.")
        except ValueError as e:
            print(f"Error parsing JSON response: {e}")
    else:
        print(f"Failed to retrieve token, status code: {response.status_code}")

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
                print("Successfully Authenticated.... Retrieved IdToken!")
                return access_token
            else:
                print("IdToken not found in the response.")
        except ValueError as e:
            print(f"Error parsing JSON response: {e}")
    else:
        print(f"Failed to retrieve token, status code: {response.status_code}")

def API_FETCH_USER_SETTINGS():
    url = 'http://127.0.0.1:5000/user/settings'

    headers = {
        'Authorization': f'Bearer {retrieve_access_token()}',
    }

    response = requests.get(url, headers=headers)
    print(response.json())
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
            "http://127.0.0.1:5000/gateway/upload",
            files=files,
            headers=headers
        )
        
        try:
            response_data = response.json()
            print(response_data)
        except ValueError as e:
            print("Error parsing JSON:", e)
        print("Status Code:", response.status_code)
