import boto3
import os
import hmac
import hashlib
import base64
import jwt
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

@app.route('/update_video', methods=['POST'])
def update_video():
    token = request.headers.get('Authorization').split(" ")[1]
    decoded = jwt.decode(token, options={"verify_signature": False})
    username = decoded.get('username')
    data = request.json
    videoID = data['videoID']
    user_table_scan = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@" + username))
    video_scan = table.scan(FilterExpression=Attr('videoID').contains(videoID))
    items = video_scan.get('Items', [])
    user_items = user_table_scan.get('Items', [])
    print(username)
    print(items[0].get('owner'))
    if username != items[0].get('owner').lower() and user_items[0].get('admin') != True: 
        return jsonify({'error': 'Cannot edit that video as youre not the video owner.'}), 403
    
    title = data.get('title', '')
    description = data.get('description', '')
    tags = data.get('tags', [])
    publicVideo = data.get('publicVideo', [])
    response = table.update_item(
        Key={
            'videoID': videoID
        },
        UpdateExpression='SET title = :title, description = :desc, tags = :tags, publicVideo = :publicVideo',
        ExpressionAttributeValues={
            ':title': title,
            ':desc': description,
            ':tags': tags,
            ':publicVideo': publicVideo
        },
        ReturnValues="UPDATED_NEW"
    )

    return jsonify({'message': 'Video updated successfully', 'updatedAttributes': response}), 200
