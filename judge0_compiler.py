import requests, os
import base64
from dotenv import load_dotenv
from colorama import Fore, Style

try:
    load_dotenv()
    url = "https://judge0-ce.p.rapidapi.com/submissions"
    rapidAI_key = os.getenv("RAPIDAPI_KEY")
except Exception as e:
    print(f"{Fore.RED}Judge0 Connection Error: {e} \n{Style.RESET_ALL}")


# Generate a submission and send it to RapidAI's Judge0 Client for compilation
def create_submission(source_code):
    querystring = {"base64_encoded": "true", "wait": "true", "fields": "*"}
    encoded_source_code = base64.b64encode(source_code.encode("utf-8")).decode("utf-8")
    payload = {
        "language_id": 71,
        "source_code": encoded_source_code,
        "stdin": "",
    }
    headers = {
        "x-rapidapi-key": rapidAI_key,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, json=payload, headers=headers, params=querystring)
        return response.json()["token"]
    except Exception as e:
        print(
            f"{Fore.RED}Judge0 - Failed to create submission : {e} \n{Style.RESET_ALL}"
        )


# Fetch the compiled code using the unqiue token
def get_submission(token):
    get_url = url + f"/{token}"
    querystring = {"base64_encoded": "true", "fields": "*"}

    headers = {
        "x-rapidapi-key": rapidAI_key,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    }

    try:
        response = requests.get(get_url, headers=headers, params=querystring)
        output = base64.b64decode(response.json()["stdout"]).decode("utf-8")
        return output
    except Exception as e:
        print(
            f"{Fore.RED}Judge0 - Failed to fetch submission : {e} \n{Style.RESET_ALL}"
        )
