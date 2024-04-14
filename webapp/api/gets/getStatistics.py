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
table = dynamodb.Table('cliprVideoDB')

@app.route('/statistics')
def statistics():
    total_clips_today = 0
    response = table.scan()
    current_date = datetime.now().strftime('%Y-%m-%d')
    for i in response.get('Items'): 
        if current_date == i.get('upload_date'):
            total_clips_today += 1
    json = {"totalVideosClipped": response['Count'], "totalClips_Today": total_clips_today}
    return json
