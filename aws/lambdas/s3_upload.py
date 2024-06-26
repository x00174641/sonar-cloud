import json
import base64
import boto3 

def lambda_handler(event, context):
    s3 = boto3.client("s3")
    dynamodb = boto3.resource('dynamodb')
    profile_table = dynamodb.Table('cliprDB')
    videos_table = dynamodb.Table('cliprVideoDB')
    file_name = event["file_name"]
    username = event["username"]
    get_file_content = event['file_content']

    decode_content = base64.b64decode(get_file_content)

    s3.put_object(
        Bucket="cliprbucket",
        Key="videos/" + file_name,
        Body=decode_content,
        ContentType='video/mp4'
    )
    
    profile_table.update_item(
        Key={'username': username},
        UpdateExpression="SET videos = list_append(if_not_exists(videos, :empty_list), :new_file)",
        ExpressionAttributeValues={':new_file': [file_name],':empty_list': []},
    )
    
    videos_table.put_item(Item={'videoID': file_name.replace('videos/',''), 'public': False, 'owner': username})

    return {"statusCode": 200, "body": json.dumps("Successfully uploaded video.")}