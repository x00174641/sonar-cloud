import pytest
import requests
import os

@pytest.fixture
def login_api_url():
    return 'https://api.clipr.solutions/login'

@pytest.fixture
def gateway_upload_api_url():
    return 'https://api.clipr.solutions/gateway/upload'

def credentials():
    return {'username': 'test', 'password': 'Test12345!'}

def credentials2():
    return {'username': 'Test2', 'password': 'Test12345!'}

@pytest.fixture
def delete_api_url():
    return 'https://api.clipr.solutions/delete/videos/?videoID=67198_test.mkv'

@pytest.fixture
def edit_video_api_url():
    return 'https://api.clipr.solutions/update_video'

def test_upload_success(login_api_url, gateway_upload_api_url):
    file_path = os.path.join(os.path.dirname(__file__), 'assets', '67198_test.mkv')
    data = credentials()
    response = requests.post(login_api_url, json=data)
    access_token = response.json().get('accessToken')

    with open(file_path, 'rb') as video_file:
        files = {
            'file_content': (os.path.basename(file_path), video_file, 'video/mp4')
        }
        
        data = {
            'accessToken': access_token,
            'file_name': os.path.basename(file_path)
        }
        
        headers = {
            'clipr_auth_token': access_token
        }
        
        response = requests.post(gateway_upload_api_url, files=files, data=data, headers=headers)
        
        if response.status_code != 200:
            print(response.text)
        
        assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"
        assert response.json()['message'] == "Successfully uploaded video.", "Upload failed"

        print("Test passed successfully!")


def test_edit_success(login_api_url, edit_video_api_url):
    data = credentials()
    response = requests.post(login_api_url, json=data)
    access_token = response.json().get('accessToken')
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        "videoID": "67198_test.mkv",
        "title": "TEST",
    }
    response = requests.post(edit_video_api_url, json=data, headers=headers)
        
    if response.status_code != 200:
        print(response.text)
        
    assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"
    assert response.json()['message'] == "Video updated successfully"

def test_edit_failure_permissionless_user(login_api_url, edit_video_api_url):
    data = credentials2()
    response = requests.post(login_api_url, json=data)
    access_token = response.json().get('accessToken')
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        "videoID": "67198_test.mkv",
        "title": "TEST",
    }
    response = requests.post(edit_video_api_url, json=data, headers=headers)
    assert response.status_code == 403, f"Expected status code 403, but got {response.status_code}"
    assert response.json()['error'] == "Cannot edit that video as youre not the video owner."

def test_delete_failure_permissionless_user(login_api_url, delete_api_url):
    data = credentials2()
    response = requests.post(login_api_url, json=data)
    access_token = response.json().get('accessToken')
    headers = {
            'Authorization': f'Bearer {access_token}'
    }
    response = requests.delete(delete_api_url,  headers=headers)
        
    assert response.status_code == 403, f"Expected status code 403, but got {response.status_code}"
    assert response.json()['error'] == "Cannot delete that video as youre not the video owner."
    
def test_delete_success(login_api_url, delete_api_url):
    data = credentials()
    response = requests.post(login_api_url, json=data)
    access_token = response.json().get('accessToken')
    headers = {
            'Authorization': f'Bearer {access_token}'
    }
    response = requests.delete(delete_api_url,  headers=headers)
        
    if response.status_code != 200:
        print(response.text)
        
    assert response.status_code == 200, f"Expected status code 200, but got {response.status_code}"
    assert response.json()['message'] == "Video deleted successfully."