import boto3
import os
import hmac
import hashlib
import base64
import requests
import json
import jwt
from datetime import datetime
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
s3 = boto3.client("s3", aws_access_key_id=access_key, aws_secret_access_key=access_secret)

# Routes 
@app.route('/')
def index():
    username = session.get('username')
    if username:
        return render_template('index.html', username=username)
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if create_user(username, email, password):
        return jsonify({'message': 'Account created successfully. Please check your email to verify your account.'}), 200
    else:
        return jsonify({'message': 'Account creation failed. Please try again.'}), 400

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
        views_date_data = items[0].get('views')
        print(views_date_data)
        if not total_views:
            total_views = 0
        return jsonify({
                'username': username,
                'total_views': total_views,
                'uploaded_date': uploaded_date,
                'views_data': views_date_data
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
    username = video_data.get('username')
    video_scan = table.scan(FilterExpression=Attr('videoID').contains(videoID))
    items = video_scan.get('Items', [])

    if not items:
        return jsonify({'error': 'Video not found'}), 404

    owner = items[0].get('owner')
    if username.lower() == owner.lower():
        return jsonify({'message': 'View increment not allowed for owner'}), 200
    else:
        data_to_send = json.dumps({'videoID': video_id})
        response = requests.post('https://a255z88ipi.execute-api.us-east-1.amazonaws.com/dev/Views', data=data_to_send)
        if response.status_code == 200:
            return jsonify({'message': 'View count incremented'}), 200
        else:
            return jsonify({'error': 'Failed to increment view count'}), 500
    
@app.route('/update/clipr/software/', methods=['POST'])
def update_software():
    data = request.json
    token = data.get('accessToken')

    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        username = decoded.get('username')
        clip_interval = data.get('clip_interval')
        clip_hotkey = data.get('clip_hotkey')
        obs_port = data.get('obs_port')
        response = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@"+username))
        items = response.get('Items', [])

        update_response = user_profile_table.update_item(
            Key={
                'username': items[0].get('username')
            },
            UpdateExpression="SET clip_interval = :ci, clip_hotkey = :ch, obs_port = :op",
            ExpressionAttributeValues={
                ':ci': clip_interval,
                ':ch': clip_hotkey,
                ':op': obs_port
            },
            ReturnValues="UPDATED_NEW"
        )
        
        return jsonify({'message': update_response}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occurred'}), 500 

@app.route('/user/settings', methods=['GET'])
def fetch_user_settings():
    token = request.headers.get('Authorization').split(" ")[1]
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        username = decoded.get('username')
        response = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@" + username))
        items = response.get('Items', [])
        if items:
            clip_interval = items[0].get('clip_interval')
            clip_hotkey = items[0].get('clip_hotkey')
            obs_port = items[0].get('obs_port')
            return jsonify({'clip_interval': clip_interval, 'clip_hotkey': clip_hotkey, 'obs_port': obs_port})
        return jsonify({'message': 'User settings not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/gateway/upload', methods=['POST'])
def upload_video_to_s3_bucket():
    try:
        profile_table = dynamodb.Table('cliprDB')
        videos_table = dynamodb.Table('cliprVideoDB')

        file = request.files['file_content']
        accessToken = request.form['accessToken']
        file_name = request.form['file_name']
        decoded = jwt.decode(accessToken, options={"verify_signature": False})
        username = decoded.get('username')
        file_content = file.read()

        s3.put_object(
            Bucket="cliprbucket",
            Key=f"videos/{file_name}",
            Body=file_content,
            ContentType='video/mp4'
        )

        current_date = datetime.now().strftime('%Y-%m-%d')

        response = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@" + username))
        items = response.get('Items', [])
        if not items:
            raise ValueError(f"User {username} not found.")

        profile_table.update_item(
            Key={'username': items[0].get('username')},
            UpdateExpression="SET videos = list_append(if_not_exists(videos, :empty_list), :new_file)",
            ExpressionAttributeValues={
                ':new_file': [file_name],
                ':empty_list': []
            },
        )

        videos_table.put_item(
            Item={
                'videoID': file_name,
                'public': False,
                'owner': items[0].get('username'),
                'upload_date': current_date,
                'total_views': 0,
                'total_likes': 0,
                'total_dislikes': 0,
                'views': []
            }
        )

        return jsonify({"message": "Successfully uploaded video."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    