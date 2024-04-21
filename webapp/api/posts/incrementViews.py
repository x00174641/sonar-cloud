import boto3
import os
import requests
import json
import jwt
from botocore.exceptions import ClientError
from webapp import app
from flask import request, session, jsonify
from boto3.dynamodb.conditions import Attr

access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')
table = dynamodb.Table('cliprVideoDB')

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