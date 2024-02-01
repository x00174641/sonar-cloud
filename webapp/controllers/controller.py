import boto3
import os
import hmac
import hashlib
import base64
import requests
import json
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

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

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
            return jsonify({
                'success': True,
                'accessToken': response['AuthenticationResult']['AccessToken'],
                'username': username
            }), 200

        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'UserNotConfirmedException':
                return jsonify({'error': 'Account not confirmed'}), 403
            else:
                return jsonify({'error': 'Login failed'}), 401
    return jsonify({'message': 'Invalid request method'}), 405

@app.route('/videos/<videoID>')
def video(videoID):
    try:
        response = table.scan(
            FilterExpression=Attr('videoID').contains(videoID)
        )
        items = response.get('Items', [])
        username = items[0].get('owner')
        total_views = items[0].get('total_views')
        uploaded_date = items[0].get('upload_date')
        if not total_views:
            total_views = 0
        return jsonify({
                'username': username,
                'total_views': total_views,
                'uploaded_date': uploaded_date
            }), 200

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
        return jsonify({
                'success': True,
                'video_list': video_list,
                'username': username
            }), 200
    except Exception as e:
        return str(e), 500

@app.route('/statistics')
def statistics():
    response = table.scan()
    json = {"totalVideosClipped": response['Count']}
    return json

@app.route('/view_increment/<videoID>', methods=['POST'])
def update_views(videoID):
    video_data = request.get_json()
    video_id = video_data['videoID']
    data_to_send = json.dumps({'videoID': video_id})
    response = requests.post('https://a255z88ipi.execute-api.us-east-1.amazonaws.com/dev/Views', data=data_to_send)
    print(response.text)
    return response.text 
    