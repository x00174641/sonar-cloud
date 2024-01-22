import boto3
import os
import hmac
import hashlib
import base64
from botocore.exceptions import ClientError
from webapp import app
from flask import render_template, request, flash, redirect, url_for , session, jsonify
from webapp.models.models import create_user
from boto3.dynamodb.conditions import Attr

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
client = boto3.client('cognito-idp', "us-east-1")
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')
table = dynamodb.Table('cliprVideoDB')

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

@app.route('/videos/<videoID>')
def video(videoID):
    try:
        response = table.scan(
            FilterExpression=Attr('videoID').contains(videoID)
        )
        items = response.get('Items', [])
        if not items:
            return redirect(url_for('index')) # replace with 404 page once i build that
        if session.get('username') != items[0].get('owner'):
            return redirect(url_for('index')) 
        if items[0].get('public') == False and session.get('username') != items[0].get('owner'):
            return redirect(url_for('index')) 
        
        username = items[0].get('owner')
        video_url = f"https://cliprbucket.s3.amazonaws.com/videos/videos/{videoID}"
        return render_template('videos.html', video_url=video_url, username=username)

    except Exception as e:
        return str(e), 500
    
@app.route('/user/channel/<username>')
def user_profile(username): 
    try:
        video_list = []
        response = user_profile_table.scan(FilterExpression=Attr('channelName').contains(username))
        print(response)
        items = response.get('Items', [])
        if not items:
            return redirect(url_for('index')) # replace with 404 page once i build that 
        username = items[0].get('username')
        for i in reversed(items[0].get('videos')):
            video_list.append(i.replace('videos/',''))
        return render_template('profiles.html', video_list=video_list, username=username)
    except Exception as e:
        return str(e), 500