import pytest
import requests

@pytest.fixture
def api_url():
    return 'https://api.clipr.solutions/videos/'

def test_video_info(api_url):
    video_id = '21f1cc47028d4f5eb03c3d4961335f7b'
    response = requests.get(api_url + video_id)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'
    data = response.json()
    assert 'username' in data
    assert 'total_views' in data
    assert 'uploaded_date' in data
    assert 'views_data' in data
    assert 'tags' in data
    assert 'title' in data
    assert 'description' in data
    assert 'channelName' in data
    assert 'comments' in data
    assert 'likes' in data
    assert 'commentsLen' in data
    assert 'dislikes' in data
    assert 'follower_count' in data

def test_video_not_found(api_url):
    video_id = 'non_existent_video_id'
    response = requests.get(api_url + video_id)
    assert response.status_code == 500
