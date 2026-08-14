from fastapi.testclient import TestClient

try:
    from app.main import app
except ImportError:
    from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_valid_order():
    response = client.get("/orders/ORD-1001")
    assert response.status_code == 200

    data = response.json()
    assert data["order_id"] == "ORD-1001"
    assert "product_name" in data
    assert "status" in data
    assert "carrier" in data
    assert "tracking_number" in data
    assert "estimated_delivery" in data


def test_customer_name_not_exposed():
    response = client.get("/orders/ORD-1001")
    assert response.status_code == 200

    data = response.json()
    assert "customer_name" not in data


def test_get_nonexistent_order():
    response = client.get("/orders/ORD-9999")
    assert response.status_code == 404
