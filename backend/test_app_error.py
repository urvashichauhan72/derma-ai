from fastapi.testclient import TestClient
from main import app
import sys

try:
    with TestClient(app) as client:
        response = client.get("/api/history")
        print(response.status_code)
        print(response.text)
except Exception as e:
    import traceback
    traceback.print_exc(file=sys.stdout)
