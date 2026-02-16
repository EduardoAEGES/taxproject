import requests

def test_server(ruc):
    url = f"http://localhost:5000/consultar-ruc?ruc={ruc}"
    print(f"Testing Local Backend: {url}")
    
    try:
        response = requests.get(url, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
    except Exception as e:
        print(f"Error connecting to localhost:5000 -> {e}")

if __name__ == "__main__":
    test_server("20100190797")
