---
title: AWS Account Setup
description: Guide on how to setup a new Orchestera Platform account
---
Once you have created your account on Orchestera Platform, you will be required to setup an AWS account.

Note that we currently only support AWS as the cloud provider and our services are limited to `us-east-1`. We are working on adding more AWS regions very soon. Please see the roadmap for details.

We highly recommend that you setup a separate [AWS Organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) to setup your Spark cluster. This allows you to separate your resources and billing for your Orchestera managed Spark clusters and prevents any interference to your other AWS account resources. There is no additional cost from AWS for setting up a separate AWS Organization.

## Setting up a new AWS Organization

This assumes that you have access to your main AWS root account. If not, ask your organization admin to perform the following steps instead:

### Enable multi-session support

To enable multi-session support in your AWS account:

1. Log into the AWS Console
2. Click on your account name in the top-right corner
3. Look for the "Turn on multi-session support" button in the dropdown menu
4. Click the button to enable multi-session support

<a href="/enable-multisession-annotated.png" target="_blank">
<img src="/enable-multisession-annotated.png" alt="AWS Console showing multi-session support button" style="cursor: pointer;" />
</a>

This feature allows you to have multiple browser sessions open simultaneously, which is useful when working with different AWS accounts or regions.

 
### Convert your root account to a management account

Go the AWS Organization page in your AWS console and click Create Organization. If this is the first organization that's being created, you will see the following prompt. Click *Create an organization* button. If you already have AWS Organization enabled, you can skip to the next step.

<a href="/becoming-management-account.png" target="_blank">
<img src="/becoming-management-account.png" alt="Convert to a management account" style="cursor: pointer;" />
</a>


Now, on your AWS Organizations page, you will see something like the following. Take a note of the **management account id** that would be needed later.

<a href="/aws-root-org-page.png" target="_blank">
<img src="/aws-root-org-page.png" alt="Convert to a management account" style="cursor: pointer;" />
</a>

### Setup a new AWS Organization

You can either create a new AWS account or invite an existing AWS account to your Organization. For the purpose of this tutorial, we will create a new AWS account called `Orchestera Sparklith` and this is the recommended flow. Make sure to provide an unused email to associate with your new account and also make sure that the IAM role name is set to `OrganizationAccountAccessRole`. Finally Create the AWS account.

<a href="/add-aws-account.png" target="_blank">
<img src="/add-aws-account.png" alt="Add a new AWS account" style="cursor: pointer;" />
</a>

Once your account is created, also note the **member account id** of this new account under AWS Organizations > AWS accounts page.


At this point, you should have the following two account ids at hand:

- Management account id from when you converted your root account to a management account
- Member account id for `Orchestera Sparklith`


### Setup IAM roles, users and groups

While you are still logged-in as root in your management account, go to IAM, navigate to **Policies** and click **Create policy** and go through the following steps:



1. On the Visual editor tab, choose Select a service, enter STS in the search box to filter the list, and then choose the STS option.

2. In the Actions section, enter assume in the search box to filter the list, and then choose the AssumeRole option.

3. In the Resources section, choose Specific, choose Add ARNs

4. In the Specify ARN(s) section, choose Other account for Resource in.

5. Enter the ID of the member account `Orchestera Sparklith` you just created

6. For Resource role name with path, enter the name of the role that you created in the previous section (OrganizationAccountAccessRole).

<a href="/specify-arns.png" target="_blank">
<img src="/specify-arns.png" alt="Add a new AWS account" style="cursor: pointer;" />
</a>

7. Choose Add ARNs when the dialog box displays the correct ARN.

8. Choose Next.

9. On the Review and create page, enter a name for the new policy. For example : `GrantAccessToOrganizationAccountAccessRole`. You can also add an optional description.

10. Choose Create policy to save your new managed policy. The final policy in the JSON format will look like the following:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "arn:aws:iam::<member-account-id>:role/OrganizationAccountAccessRole"
        }
    ]
}
```

11. Now that you have the policy available, you can attach it to a group.

12. Go back to the IAM > User groups page and click **Create group** and call it `orchestera-admin-group`.

13. In the attach permissions policies, select **AdministratorAccess** and **GrantAccessToOrganizationAccountAccessRole** that you added in the previous step.

14. Finally, add your relevant IAM users to the `orchestera-admin-group` so that they can switch to the `Orchestera Sparklith` that was created previously.


### Signing in with an IAM user into `Orchestera Sparklith` account

Assuming that you have followed all the steps from the previous section, your IAM users can now login to the `Orchestera Sparklith` organization as follows.

1. Log out from the root account

2. Go to AWS Console login page

-- Enter Account ID of the management account
-- Enter your IAM user name
-- Enter your password and **Sign in**

3. Turn on multi-session support if it's not already turned on

    <a href="/multi-session-support.png" target="_blank">
    <img src="/multi-session-support.png" alt="Add a new AWS account" style="cursor: pointer;" />
    </a>

4. Click on Add session > New role

5. In the Account ID box, enter the member account id of your `Orchestera Sparklith` account

6. In the IAM role name, enter `OrganizationAccountAccessRole` and click **Switch Role**

7. Your are now logged into the `Orchestera Sparklith` member account which will be used to setup your Spark EKS clusters


### References

- [AWS docs on setting up a member account](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access-cross-account-role.html#step-choose-group)


## Giving Orchestera Platform access to operate on your AWS account

We established all the pre-requisites in the previous section to setup a separate account to create and manage Spark clusters. In this section, we will grant Orchestera Platform permissions to orchesterate and standup Spark clusters in your new `Orchestera Sparklith` AWS account.

### Create `OrchesteraAccessPolicy` in your member account

You should be logged into the member account (Orchestera Sparklith) to create this policy since Orchestera Platform only needs access to your member account.

1. Go to the IAM > Policies and click on **Create policy**

2. Click on the JSON policy editor and replace all the content with the following JSON.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:*",
                "eks:*",
                "iam:CreateRole",
                "iam:AttachRolePolicy",
                "iam:PutRolePolicy",
                "iam:DeleteRolePolicy",
                "iam:DeleteRole",
                "iam:GetRole",
                "iam:ListInstanceProfilesForRole",
                "iam:ListAttachedRolePolicies",
                "iam:PassRole",
                "iam:CreateInstanceProfile",
                "iam:AddRoleToInstanceProfile",
                "iam:RemoveRoleFromInstanceProfile",
                "iam:DeleteInstanceProfile",
                "iam:GetInstanceProfile",
                "iam:ListInstanceProfiles",
                "iam:ListRolePolicies",
                "iam:TagRole",
                "iam:CreateServiceLinkedRole",
                "iam:CreateOpenIDConnectProvider",
                "iam:TagOpenIDConnectProvider",
                "iam:GetOpenIDConnectProvider",
                "iam:CreatePolicy",
                "iam:TagPolicy",
                "iam:GetPolicy",
                "cloudformation:*",
                "sqs:*",
                "pricing:GetProducts",
                "ssm:GetParameter",
                "ssm:GetParametersByPath",
                "iam:GetPolicyVersion",
                "iam:TagInstanceProfile",
                "iam:CreateInstanceProfile",
                "iam:GetInstanceProfile",
                "iam:DeleteInstanceProfile",
                "iam:AddRoleToInstanceProfile",
                "iam:RemoveRoleFromInstanceProfile",
                "iam:CreatePolicy",
                "iam:GetPolicy",
                "iam:DeletePolicy",
                "iam:ListPolicyVersions",
                "iam:TagPolicy",
                "iam:UntagPolicy"
            ],
            "Resource": "*"
        }
    ]
}
```

3. Name the policy `OrchesteraAccessPolicy` and click **Create policy**


### Create `OrchesteraAccessRole` in your member account

You should be logged into the member account (Orchestera Sparklith) to create this role.

1. Go to the IAM > Roles and click on **Create role**

2. In the **Select trusted entity** section, select **AWS account**

3. Select **Another AWS account** and enter the id `017059471480`. This is the id of the Orchestera Platform that will orchesterate Spark clusters in your account. You are essentially giveing Orchestera Platform to orchesterate resources in your member account.

4. Click Next and on the permissions page, select `OrchesteraAccessPolicy`.

5. Set `OrchesteraAccessRole` as the role name and click **Create role**

You have now successfully setup your AWS account with the right roles and permissions to allow Orchestera Platform to orchesterate Spark clusters for you. In the subsequent sections, you will be able to verify this setup as well.
