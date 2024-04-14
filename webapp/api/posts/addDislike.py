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

@app.route('/api/dislike/', methods=["POST"]) 
def dislikeVideo():
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
        dislikes = item.get('dislikes', []) 

        user_disliked = next((dislike for dislike in dislikes if dislike['username'] == username), None) 

        if user_disliked:
            dislikes.remove(user_disliked)
            response = table.update_item(
                Key={
                    'videoID': video_id 
                },
                UpdateExpression='SET dislikes = :dislikes',
                ExpressionAttributeValues={
                    ':dislikes': dislikes 
                },
            )
            return jsonify({'status': 'success', 'message': 'Dislike removed'})
        else:
            response = table.update_item(
                Key={
                    'videoID': video_id 
                },
                UpdateExpression='SET dislikes = list_append(if_not_exists(dislikes, :empty_list), :new_dislike)',
                ExpressionAttributeValues={
                    ':new_dislike': [{'username': username, 'date': current_date}], 
                    ':empty_list': []
                },
            )
            return jsonify({'status': 'success', 'message': 'Dislike added'}) 
    else:
        return jsonify({'status': 'error', 'message': 'Video not found'})