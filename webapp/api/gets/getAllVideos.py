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

@app.route('/api/getVideos', methods=["GET"])
def getVideos():
    video_list = []
    test = table.scan()
    print("hello")
    for i in test.get('Items'): 
        if i.get('public') != False:
            video_list.append(i.get('videoID'))
    return jsonify({'video_list': video_list})
