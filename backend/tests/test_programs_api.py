from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_programs_endpoint_exists_and_returns_data():
    response = client.get('/api/v1/programs')
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert 'title' in data[0]
