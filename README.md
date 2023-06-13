# Meteorological_App

## Requrment
1. Python
2. Node.js
3. NPM
   

## Installation

1. Clone the repository:

```shell
   git clone https://github.com/M4sZiz/Meteorological_App.git
```

2. Install the required Python dependencies:
```shell
    pip install -r requirements.txt
```

3. Set up the database:
```shell
    python manage.py migrate
```

4. Set up cities:
```shell
    python manage.py setup_cities insert 
```

5. Rename `.env.example` to `.env`
    - To get API (https://www.meteomatics.com/en/sign-up-weather-api-test-account/)

6. Navigate to the `App` folder then install node requirement and build it:
```shell
    cd frontend && npm i && npm run build
```

7. Start the Django development server:
```shell
    python manage.py runserver 
```




