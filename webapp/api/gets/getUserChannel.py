import boto3
import os
import requests
import json
import jwt
from botocore.exceptions import ClientError
from webapp import app
from flask import request, session, jsonify
from boto3.dynamodb.conditions import Attr

access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
user_profile_table = dynamodb.Table('cliprDB')
table = dynamodb.Table('cliprVideoDB')

@app.route('/user/channel/<username>')
def user_profile(username): 
    try:
        video_list = []
        total_views = 0
        response = user_profile_table.scan(FilterExpression=Attr('channelName').contains(username))
        
        items = response.get('Items', [])
        username = items[0].get('username')
        follower_count = len(items[0].get('followers'))
        response2 = table.scan(FilterExpression=Attr('owner').contains(username))
        
        for i in reversed(items[0].get('videos')):
            video_list.append(i.replace('videos/',''))
            response2 = table.scan(FilterExpression=Attr('videoID').contains(i.replace('videos/','')))
            items = response2.get('Items', [])
            total_views += items[0].get('total_views')

        return jsonify({
                'success': True,
                'video_list': video_list,
                'username': username,
                'total_views': total_views,
                'follower_count': follower_count,
                'total_videos': len(video_list),

            }), 200
    except Exception as e:
        return str(e), 500