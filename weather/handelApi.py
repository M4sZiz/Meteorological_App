import os
import requests

def getWeatherData(date, parameter, coordinates):
    

    url = f"https://api.meteomatics.com/{date}/{parameter}/{coordinates}/json"
    username = os.getenv('API_WEATHER_USERNAME') 
    password = os.getenv('API_WEATHER_PASWWORD')

    response = requests.get(url, auth=(username, password))

    if response.status_code == 200:
        
        return response.json().get("data")
    else:
        return None

