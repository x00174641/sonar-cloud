import pytest
import requests

@pytest.fixture
def api_url():
    return 'https://api.clipr.solutions/user/channel/'

def test_user_profile(api_url):
    username = 'lamb'
    response = requests.get(api_url + username)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'
    data = response.json()
    assert 'success' in data
    assert 'video_list' in data
    assert 'username' in data
    assert 'total_views' in data
    assert 'follower_count' in data
    assert 'total_videos' in data

def test_user_profile_not_found(api_url):
    username = 'TEST19347190470392Q7U097409178401704F09A7'
    response = requests.get(api_url + username)
    assert response.status_code == 500
