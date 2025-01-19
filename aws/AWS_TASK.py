import boto3
import base64

s3 = boto3.client('s3')

def add_nums(event, context):
    # Retrieve numbers from the event
    num1 = event.get('num1', 0)
    num2 = event.get('num2', 0)
    result = num1 + num2

    return {
        "statusCode": 200,
        "body": {"result": result}
    }

def upload_doc(event, context):
    # Retrieve bucket name and file details from the event
    bucket_name = event['bucket_name']
    file_name = event['file_name']
    file_content = base64.b64decode(event['file_content'])
    s3.put_object(Bucket=bucket_name, Key=file_name, Body=file_content)
    return {
        "statusCode": 200,
        "body": f"File {file_name} uploaded successfully to {bucket_name}"
    }
