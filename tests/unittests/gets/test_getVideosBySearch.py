import pytest
import requests

@pytest.fixture
def api_url():
    return 'https://api.clipr.solutions/search'

def test_search_titles(api_url):
    params = {'title': 'YEST'}
    response = requests.get(api_url, params=params)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'
    data = response.json()
    assert isinstance(data, list)

def test_search_titles_not_found(api_url):
    params = {'title': 'non_existing_title'}
    response = requests.get(api_url, params=params)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'application/json'
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0
