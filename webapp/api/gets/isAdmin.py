import boto3
import os
import jwt
from flask import request, jsonify
from webapp import app
from boto3.dynamodb.conditions import Attr

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')

@app.route('/isAdmin', methods=["GET"])
def isAdmin():
    token = request.headers.get('Authorization').split(" ")[1]
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        username = decoded.get('username')
        print(username)
        response = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@" + username))
        items = response.get('Items', [])
        if items:
            admin_bool = items[0].get('admin')
            print("sadioashiofashiof ashiofashiof ashfioashfoiashfoasfho",admin_bool)
            return jsonify({'isAdmin': admin_bool})
        return jsonify({'message': 'User settings not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
