import boto3
import os
import hmac
import hashlib
import base64
from botocore.exceptions import ClientError
from webapp import app
from flask import render_template, request, flash, redirect, url_for , session
from webapp.models.models import create_user

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
client = boto3.client('cognito-idp', "us-east-1")

# Routes 
@app.route('/')
def index():
    username = session.get('username')
    if username:
        return render_template('index.html', username=username)
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        if create_user(username, email, password):
            flash('Account created successfully. Please check your email for confirmation.', 'success')
            return redirect(url_for('login'))
        else:
            flash('Account creation failed. Please try again.', 'error')
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    username = session.get('username')
    if username:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        secret_hash = base64.b64encode(hmac.new(
            bytes(client_secret, 'utf-8'),
            bytes(username + client_id, 'utf-8'),
            digestmod=hashlib.sha256).digest()).decode()
        try:
            response = client.initiate_auth(
                AuthFlow='USER_PASSWORD_AUTH',
                AuthParameters={
                    'USERNAME': username,
                    'PASSWORD': password,
                    'SECRET_HASH': secret_hash
                },
                ClientId=client_id
            )

            session['access_token'] = response['AuthenticationResult']['AccessToken']
            if 'AccessToken' in response['AuthenticationResult']:
                session['access_token'] = response['AuthenticationResult']['AccessToken']
                session['username'] = username
                return redirect(url_for('index'))

        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'UserNotConfirmedException':
                flash('Your account is not confirmed. Please check your email for the confirmation link.', 'error')
            else:
                flash('Login failed. Please check your username and password.', 'error')
                print(f"Error: {e}")
    return render_template('login.html')
