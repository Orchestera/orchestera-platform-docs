---
title: Injecting secrets into your Spark jobs
description: Guide on how to inject secrets into your Spark jobs as env vars
---

**Note: You should be logged into the member account for the following steps**

You might require your Spark jobs to have access to specific secrets such as Snowflake token, DB passwords, etc. Orchestera platform allows easy injection of those into your Spark jobs as environment variables.

The following is an example of how to do that.

## Injecting secrets via AWS Parameter Store
1. In your AWS Console, search for Parameter Store
2. Click on "Create parameter"
3. Specify the name exactly as follows: `/orchestera/sparklith/<namespace>/secrets/default`. Replace `<namespace>` with the actual namespace for which you are giving pods access to.
4. Select Tier as Standard
5. Select Type as SecureString
6. In KMS key source, select My current account and leave the KMS Key ID as is, i.e. `alias/aws/ssm`
5. Paste the following in the Value area. Make sure that it's a valid JSON and has a flat structure as shown here.
```json
{
    "key1": "value1",
    "key2": "value2",
    "DATABASE_URL": "postgresql://..."
}
```

Create it and then force update the cluster from the Orchestera platform UI.

Note that you will need to re-launch your pods for them to have access to these as env.

When launching your Spark jobs via Orchestera CLI, you can specify to --pull-secrets-from flag as follows where `default` matches with the ending keyword of the path.

```
uv run python -m orchestera.clients.sync_client run \
  --namespace "prod-app" \
  --image "853027285987.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest" \
  --classpath "example.spark.application.SparkK8sHelloWorld" \
  --application-name "spark-hello-world" --pull-secrets-from default
```
