import boto3
import os
from botocore.exceptions import ClientError
from webapp import app
from flask import request, jsonify
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
s3 = boto3.client("s3", aws_access_key_id=access_key, aws_secret_access_key=access_secret)

@app.route('/deleteUser', methods=['DELETE'])
def delete_user():
    try:
        username = request.json['username']
        
        response = user_profile_table.scan(
            FilterExpression=Attr('channelName').eq("@" + username)
        )
        items = response.get('Items', [])
        
        if not items:
            return jsonify({"error": "User not found."}), 404

        user_profile = items[0]
        
        x = user_profile_table.delete_item(
            Key={'username': user_profile['username']}
        )
        print(x)
        user_videos = user_profile.get('videos', [])
        for video_id in user_videos:
            s3.delete_object(
                Bucket="cliprbucket",
                Key=f"videos/{video_id}"
            )
            table.delete_item(
                Key={'videoID': video_id}
            )

        # Delete the user from Cognito
        client.admin_delete_user(
            UserPoolId=client_pool_id,
            Username=username
        )

        return jsonify({"message": "User and associated data deleted successfully"}), 200
    except ClientError as e:
        return jsonify({"error": e.response['Error']['Message']}), 400
