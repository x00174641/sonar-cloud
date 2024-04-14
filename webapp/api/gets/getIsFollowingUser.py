import boto3
import os
import jwt
from webapp import app
from flask import request, jsonify
from boto3.dynamodb.conditions import Attr

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb', "us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')

@app.route('/check_follow_status/<channelName>')
def isUserFollowed(channelName):
    try:
        token = request.headers.get('Authorization').split(" ")[1]
        decoded = jwt.decode(token, options={"verify_signature": False})
        follower_username = decoded.get('username')
        
        response = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@" + channelName.lower()))
        
        items = response.get('Items', [])
        if items:
            followers = items[0].get('followers', [])
            is_following = False
            for follower in followers:
                if follower.get('username') == follower_username:
                    is_following = True
                    return jsonify({'isFollowing': is_following})
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print('Error checking follow status:', e)
        return jsonify({'error': 'Internal server error'}), 500
