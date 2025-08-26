---
title: AWS Account Setup
description: Guide on how to setup a new Orchestera Platform account
---
Once you have created your account on Orchestera Platform, you will be required to setup an AWS account.

Note that we currently only support AWS as the cloud provider and our services are limited to `us-east-1`. We are working on adding more AWS regions very soon. Please see the roadmap for details.

We highly recommend that you setup a separate [AWS Organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) to setup your Spark cluster. This allows you to separate your resources and billing for your Orchestera managed Spark clusters and prevents any interference to your other AWS account resources. There is no additional cost from AWS for setting up a separate AWS Organization.

### Setting up a new AWS Organization

This assumes that you have access to the AWS root account. If not, ask your organization admin to perform the following steps instead:

#### Enable multi-session support

To enable multi-session support in your AWS account:

1. Log into the AWS Console
2. Click on your account name in the top-right corner
3. Look for the "Turn on multi-session support" button in the dropdown menu
4. Click the button to enable multi-session support

<a href="/enable-multisession-annotated.png" target="_blank">
<img src="/enable-multisession-annotated.png" alt="AWS Console showing multi-session support button" style="cursor: pointer;" />
</a>

This feature allows you to have multiple browser sessions open simultaneously, which is useful when working with different AWS accounts or regions.

 