import boto3
import os
import requests
import json
import jwt
from datetime import datetime
from botocore.exceptions import ClientError
from webapp import app
from flask import request, session, jsonify
from boto3.dynamodb.conditions import Attr

access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')

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