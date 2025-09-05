---
title: AWS Account Setup
description: Guide on how to setup a new Orchestera Platform account
---
Once you have created your account on Orchestera Platform, you will be required to setup an AWS account.

Note that we currently only support AWS as the cloud provider and our services are limited to `us-east-1`. We are working on adding more AWS regions very soon. Please see the roadmap for details.

We highly recommend that you setup a separate [AWS Organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) to setup your Spark cluster. This allows you to separate your resources and billing for your Orchestera managed Spark clusters and prevents any interference to your other AWS account resources. There is no additional cost from AWS for setting up a separate AWS Organization.

### Setting up a new AWS Organization

This assumes that you have access to your main AWS root account. If not, ask your organization admin to perform the following steps instead:

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

 
#### Convert your root account to a management account

Go the AWS Organization page in your AWS console and click Create Organization. If this is the first organization that's being created, you will see the following prompt. Click *Create an organization* button. If you already have AWS Organization enabled, you can skip to the next step.

<a href="/becoming-management-account.png" target="_blank">
<img src="/becoming-management-account.png" alt="Convert to a management account" style="cursor: pointer;" />
</a>


Now, on your AWS Organizations page, you will see something like the following. Take a note of the management account id that would be needed later.

<a href="/aws-root-org-page.png" target="_blank">
<img src="/aws-root-org-page.png" alt="Convert to a management account" style="cursor: pointer;" />
</a>

#### Setup a new AWS Organization

You can either create a new AWS account or invite an existing AWS account to your Organization. For the purpose of this tutorial, we will create a new AWS account called `Orchestera Sparklith` and this is the recommended flow. Make sure to provide an unused email to associate with your new account and also make sure that the IAM role name is set to `OrganizationAccountAccessRole`. Finally Create the AWS account.

<a href="/add-aws-account.png" target="_blank">
<img src="/add-aws-account.png" alt="Add a new AWS account" style="cursor: pointer;" />
</a>

Once your account is created, also note the account id of this new account under AWS Organizations > AWS accounts page.


##### Setup IAM users and groups

While you are still logged-in as root in your management account, go to IAM > User groups and create a new group called `orchestera-admin-group`.


