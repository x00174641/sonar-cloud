import boto3
import os
import jwt
from webapp import app
from flask import request
from boto3.dynamodb.conditions import Attr

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb', "us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')

@app.route('/post_obs_password', methods=['POST'])
def postObsPassword():
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        decoded = jwt.decode(token, options={"verify_signature": False})
        username = decoded.get('username')
        
        password = request.form['password']

        response = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@" + username))

        for item in response['Items']:
            if 'password' in item and item['password'] == password:
                return "Passwords is the same"
            
            user_profile_table.update_item(
                Key={
                    'username': item['username'] 
                },
                UpdateExpression='SET password = :val',
                ExpressionAttributeValues={
                    ':val': password
                }
            )

        return "Passwords updated successfully"

    except Exception as e:
        return str(e), 400 
