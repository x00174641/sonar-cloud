import pytest
import requests
import uuid

@pytest.fixture
def login_api_url():
    return 'https://api.clipr.solutions/login'

@pytest.fixture
def update_password_api_url():
    return 'https://api.clipr.solutions/post_obs_password'

def credentials():
    return {'username': 'test', 'password': 'Test12345!'}

uuid = uuid.uuid4()

def test_upload_password_success(login_api_url, update_password_api_url):
    data = credentials()
    response = requests.post(login_api_url, json=data)
    access_token = response.json().get('accessToken')

    headers = {
        'Authorization': f'Bearer {access_token}',
    }

    data = {
        "password": uuid
    }

    response = requests.post(update_password_api_url, headers=headers, data=data)
    assert response.text == "Passwords updated successfully"

def test_upload_password_fail_password_same(login_api_url, update_password_api_url):
    data = credentials()
    response = requests.post(login_api_url, json=data)
    access_token = response.json().get('accessToken')

    headers = {
        'Authorization': f'Bearer {access_token}',
    }

    data = {
        "password": uuid
    }

    response = requests.post(update_password_api_url, headers=headers, data=data)
    assert response.text == "Passwords is the same"
