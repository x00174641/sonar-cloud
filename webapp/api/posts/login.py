import boto3
import os
import hmac
import hashlib
import base64
import requests
import json
from botocore.exceptions import ClientError
from webapp import app
from flask import request, session, jsonify
from boto3.dynamodb.conditions import Attr

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
client = boto3.client('cognito-idp', "us-east-1")
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        secret_hash = base64.b64encode(hmac.new(
            bytes(client_secret, 'utf-8'),
            bytes(username + client_id, 'utf-8'),
            digestmod=hashlib.sha256).digest()).decode()

        try:
            response = client.initiate_auth(
                AuthFlow='USER_PASSWORD_AUTH',
                AuthParameters={
                    'USERNAME': username,
                    'PASSWORD': password,
                    'SECRET_HASH': secret_hash
                },
                ClientId=client_id
            )
            session['access_token'] = response['AuthenticationResult']['AccessToken']
            return jsonify({
                'success': True,
                'accessToken': response['AuthenticationResult']['AccessToken'],
                'username': username
            }), 200

        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'UserNotConfirmedException':
                return jsonify({'error': e.response['Error']['Message']}), 403
            else:
                return jsonify({'error': e.response['Error']['Message']}), 401
    return jsonify({'message': 'Invalid request method'}), 405
