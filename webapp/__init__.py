import secrets
from flask import Flask
from flask_cors import CORS
app = Flask("webapp")
from webapp.api.posts import *
from webapp.api.gets import *
from webapp.api.deletes import *
CORS(app, origins=["*"])
secret_key = secrets.token_hex(16)
app.secret_key = secret_key
