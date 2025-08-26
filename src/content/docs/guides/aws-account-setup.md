---
title: AWS Account Setup
description: Guide on how to setup a new Orchestera Platform account
---
Once you have created your account on Orchestera Platform, you will be required to setup an AWS account.

Note that we currently only support AWS as the cloud provider and our services are limited to us-east-1. We are working on adding more AWS regions very soon.

We highly recommend that you setup a separate [AWS Organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) to setup your Spark cluster. This allows you to separate your resources and billing for your Orchestera managed Spark clusters and prevents any interference to your other AWS account resources. There is no additional cost from AWS for setting up a separate AWS Organization.

### Setting up a new AWS Organization

This is how