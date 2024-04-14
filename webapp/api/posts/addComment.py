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

@app.route('/api/comment/', methods=["POST"])
def postComment():
    current_date = datetime.now().strftime('%Y-%m-%d')
    token = request.headers.get('Authorization').split(" ")[1]
    data = request.json
    video_id = data.get('videoID')
    comment = data.get('comment')
    print(video_id)
    decoded = jwt.decode(token, options={"verify_signature": False})
    username = decoded.get('username')

    response = table.get_item(
        Key={
            'videoID': video_id
        }
    )
    if 'Item' in response: 
        response = table.update_item(
            Key={
                'videoID': video_id 
            },
            UpdateExpression='SET comments = list_append(if_not_exists(comments, :empty_list), :new_comment)',
            ExpressionAttributeValues={
                ':new_comment': [{'username': username, 'comment': comment, 'date': current_date}],
                ':empty_list': []
            },
        )
        return jsonify({'status': 'success', 'message': 'Comment posted'})
    else:
        return jsonify({'status': 'error', 'message': 'Video not found'})
