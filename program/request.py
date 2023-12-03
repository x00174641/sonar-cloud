import boto3
import os
import requests
from dotenv import load_dotenv
load_dotenv()
# AWS credentials and S3 bucket configuration
aws_access_key_id = os.getenv('ACCESS_KEY')
aws_secret_access_key = os.getenv('SECRET_KEY')
client_id = os.getenv('COGNITO_APP_CLIENT_ID')
region_name = 'us-east-1'
bucket_name = 'cliprbucket'
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')

def upload_video_to_s3(local_video_file_path, s3_key):
    local_video_file_path = local_video_file_path.replace('\\', '/')
    with open(local_video_file_path, 'rb') as video_file:
        files = {
            'file': (s3_key, video_file, 'video/mp4')
        }
        response = requests.post("https://wso98fmze8.execute-api.us-east-1.amazonaws.com/Dev/post/", files=files)

    print("Response:", response.text)
    try:
        print(response.json())
    except ValueError as e:
        print("Error parsing JSON:", e)
    print("Status Code:", response.status_code)
    # try:
    #     # Create an S3 client
    #     s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key, region_name=region_name)
    #     s3.list_objects_v2(Bucket=bucket_name)
    #     # Upload the video file to S3
    #     s3.upload_file(local_video_file, bucket_name, s3_key)

    #     print(f'Successfully uploaded {local_video_file} to {bucket_name}/{s3_key}')
    # except Exception as e:
    #     print(f'Error uploading video to S3: {str(e)}')