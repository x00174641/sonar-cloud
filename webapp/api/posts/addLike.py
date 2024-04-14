import boto3
import os
import hmac
import hashlib
import base64
import jwt
from datetime import datetime
from flask import request, jsonify
from webapp import app
from boto3.dynamodb.conditions import Attr

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')
table = dynamodb.Table('cliprVideoDB')
s3 = boto3.client("s3", aws_access_key_id=access_key, aws_secret_access_key=access_secret)

@app.route('/api/like/', methods=["POST"])
def likeVideo():
    current_date = datetime.now().strftime('%Y-%m-%d')
    token = request.headers.get('Authorization').split(" ")[1]
    data = request.json
    video_id = data.get('videoID')
    print(video_id)
    decoded = jwt.decode(token, options={"verify_signature": False})
    username = decoded.get('username')

    response = table.get_item(
        Key={
            'videoID': video_id
        }
    )
    if 'Item' in response: 
        item = response['Item']
        likes = item.get('likes', [])

        user_liked = next((like for like in likes if like['username'] == username), None)

        if user_liked:
            likes.remove(user_liked)
            response = table.update_item(
                Key={
                    'videoID': video_id 
                },
                UpdateExpression='SET likes = :likes',
                ExpressionAttributeValues={
                    ':likes': likes
                },
            )
            return jsonify({'status': 'success', 'message': 'Like removed'})
        else:
            response = table.update_item(
                Key={
                    'videoID': video_id 
                },
                UpdateExpression='SET likes = list_append(if_not_exists(likes, :empty_list), :new_like)',
                ExpressionAttributeValues={
                    ':new_like': [{'username': username, 'date': current_date}],
                    ':empty_list': []
                },
            )
            return jsonify({'status': 'success', 'message': 'Like added'})
    else:
        return jsonify({'status': 'error', 'message': 'Video not found'})
