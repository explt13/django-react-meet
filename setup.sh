#!/bin/bash


# install requirements 
pip install -r requirements.txt

# run python server localhost:8000
start bash -c "python manage.py runserver"

# navigate into frontend directory
cd frontend

# install node packages
npm install

# start react localhost:3000
npm start