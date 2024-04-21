import pytest
import requests

@pytest.fixture
def api_url():
    return 'https://api.clipr.solutions/statistics'

def test_statistics(api_url):
    response = requests.get(api_url)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'
    data = response.json()
    assert 'totalVideosClipped' in data
    assert 'totalClips_Today' in data
    assert 'total_users' in data
    assert 'total_views' in data
    assert 'users' in data

