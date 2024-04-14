import boto3
import os
import hmac
import hashlib
import base64
import requests
import json
from webapp import app
from flask import request, jsonify
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')
client = boto3.client('cognito-idp', "us-east-1")

@app.route('/confirm_user_by_code/<username>', methods=['POST'])
def confirmUser(username):
    try:
        data = request.json
        print(data.get('code'))
        print(username)
        secret_hash = base64.b64encode(hmac.new(
            bytes(client_secret, 'utf-8'),
            bytes(username + client_id, 'utf-8'),
            digestmod=hashlib.sha256).digest()).decode()
        response = client.confirm_sign_up(
            ClientId=client_id,
            Username=username,
            ConfirmationCode=data.get('code'),
            SecretHash=secret_hash
        )
        print(response)
        return jsonify({"success": "Success! Your account is verified."}), 200
    except ClientError as e:
        if e.response['Error']['Code'] == 'CodeMismatchException':
            return jsonify({"error": "Invalid verification code provided, please try again."}), 403
        elif e.response['Error']['Code'] == 'LimitExceededException':
            return jsonify({"error": "Attempt limit exceeded, please try after some time."}), 403
        else:
            return jsonify({"error": e}), 500
    except Exception as e:
        return jsonify({"error": "An error occurred while confirming user."}), 500
