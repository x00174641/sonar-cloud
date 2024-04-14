import boto3
import os
import jwt
from datetime import datetime
from webapp import app
from flask import request, jsonify
from boto3.dynamodb.conditions import Attr

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')

@app.route('/follow_user/<channelName>', methods=['POST'])
def follow_user(channelName):
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    token = request.headers.get('Authorization').split(" ")[1]
    decoded = jwt.decode(token, options={"verify_signature": False})
    follower_username = decoded.get('username')
    if follower_username.lower() == channelName.lower():
        return jsonify({'status': 'error', 'message': 'Cannot follow yourself.'}), 403

    response = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@" + channelName.lower()))
    print("@" + channelName.lower())
    if 'Items' in response and len(response['Items']) > 0:
        item = response['Items'][0]
        followers = item.get('followers', [])

        follower = {'username': follower_username}

        if follower in followers:
            followers.remove(follower)
            response = user_profile_table.update_item(
                Key={
                    'username': item['username'] 
                },
                UpdateExpression='SET followers = :followers',
                ExpressionAttributeValues={
                    ':followers': followers
                },
            )
            return jsonify({'status': 'success', 'message': 'User unfollowed'})
        else:
            followers.append(follower)
            response = user_profile_table.update_item(
                Key={
                    'username': item['username'] 
                },
                UpdateExpression='SET followers = :followers',
                ExpressionAttributeValues={
                    ':followers': followers
                },
            )
            return jsonify({'status': 'success', 'message': 'User followed'})
    else:
        return jsonify({'status': 'error', 'message': 'User not found'})
