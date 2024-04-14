from flask import  request, session, jsonify
from webapp.models.models import create_user
from webapp import app

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    return create_user(username, email, password)
