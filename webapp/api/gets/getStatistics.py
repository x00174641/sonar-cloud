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

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
client_pool_id = os.getenv('COGNITO_USER_POOL_ID')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
client = boto3.client('cognito-idp', "us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')
table = dynamodb.Table('cliprVideoDB')

@app.route('/statistics')
def statistics():
    total_clips_today = 0
    total_views = 0 
    response = table.scan()
    current_date = datetime.now().strftime('%Y-%m-%d')
    for i in response.get('Items'): 
        if current_date == i.get('upload_date'):
            total_clips_today += 1

    for i in response.get('Items'): 
            total_views += i.get('total_views')
    users_response = client.list_users(UserPoolId=client_pool_id)
    users = users_response['Users']
    
    filtered_users = {}
    for user in users:
        username = user['Username']
        creation_date = user['UserCreateDate']
        is_confirmed = False
        email = None
        for attribute in user['Attributes']:
            if attribute['Name'] == 'email_verified':
                is_confirmed = attribute['Value'] == 'true'
            elif attribute['Name'] == 'email':
                email = attribute['Value']
        filtered_users[username] = {
            'Email': email,
            'IsConfirmed': is_confirmed,
            'CreationDate': creation_date
        }

    unique_users = [{'Username': username, **data} for username, data in filtered_users.items()]

    json_data = {
        "totalVideosClipped": response['Count'],
        "totalClips_Today": total_clips_today,
        "users": unique_users,
        "total_users": len(unique_users),
        "total_views": total_views
    }
    return jsonify(json_data)