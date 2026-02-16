import requests
from bs4 import BeautifulSoup

def consultar_ruc(ruc):
    # Crear sesión para mantener cookies
    session = requests.Session()
    
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    # 1️⃣ Hacer GET para obtener token y cookies
    url_get = "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp"
    response_get = session.get(url_get, headers=headers)

    soup_get = BeautifulSoup(response_get.text, "html.parser")
    token_input = soup_get.find("input", {"name": "token"})

    if not token_input:
        return "No se pudo obtener el token."

    token = token_input["value"]

    # 2️⃣ Hacer POST con el RUC
    url_post = "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias"

    data = {
        "accion": "consPorRuc",
        "nroRuc": ruc,
        "contexto": "ti-it",
        "modo": "1",
        "rbtnTipo": "1",
        "search1": ruc,
        "tipdoc": "1",
        "token": token
    }

    response_post = session.post(url_post, data=data, headers=headers)

    soup_post = BeautifulSoup(response_post.text, "html.parser")

    # 3️⃣ Extraer Razón Social
    # Buscamos h4 y limpiamos
    h4 = soup_post.find("h4")
    
    if h4:
        # El texto suele venir como "20614713993 - ALTAGRACIA PERU S.A.C."
        # Queremos solo el nombre
        texto = h4.text.strip()
        parts = texto.split('-')
        if len(parts) > 1:
            return parts[-1].strip()
        return texto
    else:
        return "No se encontró información para el RUC."

# -------------------------------
# EJECUCIÓN
# -------------------------------

if __name__ == "__main__":
    ruc = "20614713993"
    print(f"Consultando RUC: {ruc}...")
    resultado = consultar_ruc(ruc)
    print("\nRazón Social:")
    print(resultado)
