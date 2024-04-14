import boto3
import os
import hmac
import hashlib
import base64
import jwt
from flask import request, jsonify
from boto3.dynamodb.conditions import Attr
from webapp import app

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')
table = dynamodb.Table('cliprVideoDB')
s3 = boto3.client("s3", aws_access_key_id=access_key, aws_secret_access_key=access_secret)

@app.route('/delete/videos/', methods=['DELETE'])
def delete_video():
    token = request.headers.get('Authorization').split(" ")[1]
    video_id = request.args.get('videoID')
    
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        username = decoded.get('username')
        
        response = user_profile_table.scan(
            FilterExpression=Attr('channelName').contains("@" +username)
        )
        items = response.get('Items', [])
        
        if not items:
            return jsonify({"error": "User not found."}), 404

        user_profile = items[0]
        if 'videos' not in user_profile or video_id not in user_profile['videos']:
            return jsonify({"error": "Video ID not found in user's profile."}), 404
        
        video_index = user_profile['videos'].index(video_id)
        
        user_profile_table.update_item(
            Key={'username': user_profile.get('username')},
            UpdateExpression=f"REMOVE videos[{video_index}]",
        )
        
        s3.delete_object(
            Bucket="cliprbucket",
            Key=f"videos/{video_id}"
        )

        table.delete_item(
            Key={'videoID': video_id}
        )
        
        return jsonify({"message": "Video deleted successfully."}), 200

    except jwt.exceptions.DecodeError:
        return jsonify({"error": "Invalid token."}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
