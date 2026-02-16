import requests

def debug_ruc(ruc):
    url = f"https://api.apis.net.pe/v1/ruc?numero={ruc}"
    print(f"Testing public API: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Nombre: {data.get('nombre')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_ruc("10460693395")
