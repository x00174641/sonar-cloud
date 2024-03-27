import boto3
import os
import hmac
import hashlib
import base64
from botocore.exceptions import ClientError
from dotenv import load_dotenv

def configure():
    load_dotenv()

client_id = os.getenv('COGNITO_APP_CLIENT_ID')
client_secret = os.getenv('COGNITO_APP_CLIENT_SECRET')
access_key = os.getenv('ACCESS_KEY')
access_secret = os.getenv('SECRET_KEY')
client = boto3.client('cognito-idp', "us-east-1")
dynamodb = boto3.resource('dynamodb',"us-east-1", aws_access_key_id=access_key, aws_secret_access_key=access_secret)
table = dynamodb.Table('cliprDB')

def create_user(username, email, password):
    try:
        secret_hash = base64.b64encode(hmac.new(
            bytes(client_secret, 'utf-8'),
            bytes(username + client_id, 'utf-8'),
            digestmod=hashlib.sha256).digest()).decode()
        user_attributes = [{
            'Name': 'email',
            'Value': email
        }]
        response = client.sign_up(
            ClientId=client_id,
            Username=username,
            Password=password,
            UserAttributes=user_attributes,
            SecretHash=secret_hash
        )
        table.put_item(Item={'username': username, 'channelName': "@" + username.lower() ,'email': email, 'videos': [], 'admin': False})

        return True
    except ClientError as e:
        print(f"Error: {e}")
        return False

configure()