import pytest
import requests

@pytest.fixture
def api_url():
    return 'https://api.clipr.solutions/login' 

def credentials():
    return {'username': 'test', 'password': 'Test12345!'}

def test_login_success(api_url):
    data = credentials()
    response = requests.post(api_url, json=data)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'
    assert 'accessToken' in response.json()

def test_login_failure(api_url):
    data = {'username': 'test', 'password': 'Test12345!!'}
    response = requests.post(api_url, json=data)
    assert response.status_code in [401, 403]
    assert response.headers['Content-Type'] == 'application/json'
    assert 'error' in response.json()
