---
title: Giving your Spark jobs access to S3 and other AWS resources
description: Guide on how to provide your Spark jobs access to the S3 buckets and other AWS resources
---

**Note: You should be logged into the member account for the following steps**

Orchestera platform provides a very simple and easy way to configure your Spark jobs for S3 access and other AWS resources.

Use the following steps to configure access to any AWS resources. 

The following highlights S3 bucket access as an example but the same principles apply to any AWS resources.

## Setting up S3 access via AWS Parameter Store
1. In your AWS Console, search for Parameter Store
2. Click on "Create parameter"
3. Specify the name exactly as follows: `/orchestera/sparklith/<namespace>/iams/s3`. Replace `<namespace>` with the actual namespace for which you are giving pods access to.
4. Select Type as String and Data type as text
5. Paste the following in the Value area. Make sure that it's a valid JSON. You can use https://jsonlint.com/ for JSON validation
```json
{
    "service_account_name": "spark",
    "role_name": "sparklith-s3-full-access",
    "inline_policies": {
        "s3-full-access": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:*"
                    ],
                    "Resource": "*"
                }
            ]
        }
    },
    "tags": {
        "Purpose": "Spark S3 Full Access",
        "ManagedBy": "Sparklith"
    }
}
```

This policy would give full access to all S3 buckets in your member account to your pods in the `<namespace>` for all the Spark clusters that are launched in that member account using the Orchestera platform.

You can modify this example to give your Spark jobs access to any AWS resources.
