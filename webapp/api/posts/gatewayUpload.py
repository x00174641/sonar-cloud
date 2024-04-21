import boto3
import os
import jwt
from datetime import datetime
from flask import request, jsonify
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr
from webapp import app
from webapp.models.models import create_user

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')
table = dynamodb.Table('cliprVideoDB')
s3 = boto3.client("s3", aws_access_key_id=access_key, aws_secret_access_key=access_secret)

@app.route('/gateway/upload', methods=['POST'])
def upload_video_to_s3_bucket():
    try:
        profile_table = dynamodb.Table('cliprDB')
        videos_table = dynamodb.Table('cliprVideoDB')

        file = request.files['file']  # Corrected from request.files['file_content']
        accessToken = request.form['accessToken']
        file_name = request.form['file_name'].replace('videos/', '')
        decoded = jwt.decode(accessToken, options={"verify_signature": False})
        username = decoded.get('username')
        file_content = file.read()

        s3.put_object(
            Bucket="cliprbucket",
            Key=f"videos/{file_name}",
            Body=file_content,
            ContentType='video/mp4'
        )

        current_date = datetime.now().strftime('%Y-%m-%d')

        response = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@" + username))
        items = response.get('Items', [])
        if not items:
            raise ValueError(f"User {username} not found.")

        profile_table.update_item(
            Key={'username': items[0].get('username')},
            UpdateExpression="SET videos = list_append(if_not_exists(videos, :empty_list), :new_file)",
            ExpressionAttributeValues={
                ':new_file': [file_name],
                ':empty_list': []
            },
        )

        videos_table.put_item(
            Item={
                'videoID': file_name,
                'publicVideo': False,
                'owner': items[0].get('username'),
                'upload_date': current_date,
                'title': '',
                'description': '',
                'total_views': 0,
                'views': [],
                'likes': [],
                'dislikes': [],
                'comments': [],
                'isRecommended': False
            }
        )

        return jsonify({"message": "Successfully uploaded video."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
