import secrets
from flask import Flask
from flask_cors import CORS
app = Flask("webapp")
from webapp.controllers import *
CORS(app)
secret_key = secrets.token_hex(16)
app.secret_key = secret_key
