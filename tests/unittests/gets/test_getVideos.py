import pytest
import requests

@pytest.fixture
def api_url():
    return 'https://api.clipr.solutions/api/getVideos'

def test_getVideos(api_url):
    response = requests.get(api_url)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'
    assert 'video_list' in response.json()
