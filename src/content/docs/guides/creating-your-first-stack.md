---
title: Creating your first Spark Cluster
description: Guide on creating your first Spark Cluster (Stack) after you have setup your AWS account
---
Now that you we have set up the AWS account that can be used by the Orchestera platform, let's begin with orchesterating a fully functional, auto-scaling Spark cluster on Kubernetes.

## Setting up a Spark Cluster (Stack)

1. On your Admin Dashboard, click on "Create New Stack"
2. Provide a name for your stack. Name should be without any spaces
3. In the next step, provide the OrchesteraAccessRole are in the format `arn:aws:iam::<member-account-id>:role/OrchesteraAccessRole`
4. Provide the AWS External ID that was set when going through the AWS setup and click Verify AWS Role. If everything is configured correctly, you will get a "ROLE VERIFIED" badge and you can proceed to the next steps
5. In the namespaces step, provide at least one namespace where you would want to deploy your apps. You can have as many namespaces as you want. Namespaces provide isolation to your applications and in context of Orchestera platform, namespaces are 1:1 mapping of Kubernetes namespaces. Also note that namespaces are scoped your your individual Stack and not shared across Stacks.
6. On the Stack Management dashboard, click on the 3 dots next to your Stack and click on "View Details"
7. Click on "Provision Stack" button which will trigger your Stack provisioning

Grab a coffee while Orchestera completes the setting up of your Spark Cluster (Stack). This process can take up to **30 minutes**.



