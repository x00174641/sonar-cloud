import secrets
from flask import Flask
app = Flask("webapp")
from webapp.controllers import *
secret_key = secrets.token_hex(16)
app.secret_key = secret_key
