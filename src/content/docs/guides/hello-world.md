---
title: Giving workspace users access to the Spark K8s Cluster
description: How to give users access to the Spark K8s Cluster
---
Now that you have successfully provisioned a new Spark cluster on Kubernetes, you would want to give your team memers access to the cluster so they can start writing data pipelines.

Orchestera platform creates a default IAM group called `orchestera-platform-devs`. Any IAM user that's added to this group will have permissions to access the Spark Kubernetes cluster including listing, creating and deleting pods.

**Note: You should be logged into the member account for the following steps**


## 1. Create and add users to the `orchestera-platform-devs` group

All users who are added to the `orchestera-platform-devs` group will have access to the Spark Kubernetes cluster via their `aws_access_key_id` and `aws_secret_access_key`.

1. Create user > Enter user name > Next
2. Add user to the `orchestera-platform-devs` group
3. Go to the user profile of the created user > Security credentials > Create access key > Select Other > Create access key
4. Note down the value of Access key and Secret access key or download the .csv file for future reference


## 2. Setting up your IAM profile

You should have aws-cli configured for this step. On a Mac, you can simply install it with `brew install awscli`. 

On your local machine, add the following two files in the `~/.aws` directory:

Create file `~/.aws/config` and add the following:

```
[default]
region = us-east-1

[profile orchestera-dev]
role_arn = arn:aws:iam::<member-account-id>:role/orchestera-platform-devs
source_profile = orchestera
region = us-east-1
```


Create file `~/.aws/credentials` and add the following where `<aws_access_key_id>` and `<aws_secret_access_key>` are the user security credentials created in the previous step.
```
[orchestera]
aws_access_key_id = <aws_access_key_id>
aws_secret_access_key = <aws_secret_access_key>
```

## 3. Verify that the setup works correctly

Following steps would verify that the IAM user has permissions to access the Spark Kubernetes cluster

### Remove any cached aws tokens

```bash
rm -rf ~/.aws/cli/cache/* 
```

### Update your kube config

`<cluster-name>` is also surfaced when provisioning the cluster from the Orchestera UI. If you don't have this, ask your admin who provisioned the cluster to provide you that.

```bash
aws eks update-kubeconfig --name <cluster-name> --region us-east-1 --profile orchestera-dev
```

### Run kubectl verification and examples

```bash
# whoami verification
kubectl auth whoami

# Check if you can create pods in your relevant namespaces. Replace `data-science` with your relevant namespace
kubectl auth can-i create pods -n data-science 2>&1

kubectl auth can-i delete pods -n data-science 2>&1
```

Your Spark Kubernetes Cluster access is ready to go!
