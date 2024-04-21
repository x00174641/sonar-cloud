import boto3
import os
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

        video_scan = table.scan(FilterExpression=Attr('videoID').contains(video_id))
        video_items = video_scan.get('Items', [])
        response = user_profile_table.scan(
            FilterExpression=Attr('channelName').contains("@" + username)
        )
        items = response.get('Items', [])
        if username != video_items[0].get('owner').lower() and items[0].get('admin') != True: 
            return jsonify({'error': 'Cannot delete that video as youre not the video owner.'}), 403
        
        response2 = user_profile_table.scan(
            FilterExpression=Attr('channelName').contains("@" + video_items[0].get('owner').lower())
        )

        items2 = response2.get('Items', [])

        if not items:
            return jsonify({"error": "User not found."}), 404

        user_profile = items2[0]
        
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
