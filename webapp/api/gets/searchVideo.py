import boto3
import os
import hmac
import hashlib
import base64
import requests
import json
from webapp import app
from flask import request, jsonify
from boto3.dynamodb.conditions import Attr

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')
table = dynamodb.Table('cliprVideoDB')
s3 = boto3.client("s3", aws_access_key_id=access_key, aws_secret_access_key=access_secret)

@app.route('/search', methods=['GET'])
def search_titles():
    title = request.args.get('title').lower()
    print(title)
    try:
        response = table.scan()
        items = response['Items']
        
        filtered_items = []
        for item in items:
            if title in item['title'].lower():
                filtered_items.append(item)
        
        return jsonify(filtered_items)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500
