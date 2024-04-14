import boto3
import os
import requests
import json
import jwt
from datetime import datetime
from botocore.exceptions import ClientError
from webapp import app
from flask import request, session, jsonify
from webapp.models.models import create_user
from boto3.dynamodb.conditions import Attr

access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')

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
            password = items[0].get('password')
            return jsonify({'clip_interval': clip_interval, 'clip_hotkey': clip_hotkey, 'obs_port': obs_port, 'password': password})
        return jsonify({'message': 'User settings not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500