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

@app.route('/videos/<videoID>', methods=['GET'])
def video(videoID):
    try:
        response = table.scan(
            FilterExpression=Attr('videoID').contains(videoID)
        )
        
        items = response.get('Items', [])
        username = items[0].get('owner')
        total_views = items[0].get('total_views')
        uploaded_date = items[0].get('upload_date')
        views_date_data = items[0].get('views')
        channelName = items[0].get('channelName')
        tags = items[0].get('tags')
        title = items[0].get('title')
        description = items[0].get('description')
        publicVideo = items[0].get('publicVideo')
        comments = items[0].get('comments')
        isRecommended = items[0].get('isRecommended')
        if comments:
            commentsLen = len(comments)
        else:
            commentsLen = 0
        
        likes = items[0].get('likes')
        if likes:
            likesLen = len(likes)
        else:
            likesLen = 0
        
        dislikes = items[0].get('dislikes')
        if dislikes:
            dislikesLen = len(dislikes)
        else:
            dislikesLen = 0

        if not total_views:
            total_views = 0

        if not isRecommended:
            isRecommended = False

        response2 = user_profile_table.scan(FilterExpression=Attr('channelName').contains("@" + username.lower()))
        
        items2 = response2.get('Items', [])
        follower_count = len(items2[0].get('followers'))

        return jsonify({
                'username': username,
                'total_views': total_views,
                'uploaded_date': uploaded_date,
                'views_data': views_date_data,
                'tags': tags,
                'title': title,
                'description': description,
                'channelName': channelName,
                'comments': comments,
                'likes': likesLen,
                'commentsLen': commentsLen,
                'dislikes': dislikesLen,
                'follower_count': follower_count,
                'publicVideo': publicVideo,
                'isRecommended': isRecommended
            }), 200

    except Exception as e:
        return str(e), 500