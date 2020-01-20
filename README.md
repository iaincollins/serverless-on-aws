# serverless-pull-request-environments-with-github-actions
An example of Serverless pull request environments automatically created/removed using GitHub Actions

The purpose of this report is to develop a sample config to cater for the following use cases, to provide on-demand Pull Request serverless environments on AWS, using GitHub Actions.

## Functional requirements

1. When a change is pushed to the `master` branch on GitHub, the master branch should be deployed to production environment.
2. When a change is pushed to the `staging` branch on GitHub, the staging branch should be deployed to the staging environment.
3. When a Pull Request is raised in GitHub, the branch associated with it should be deployed and a comment left on the Pull Request with a link to the instance.
4. When code in a branch associated with a Pull Request is updated, changes should be pushed to the existing instance.
5. When a Pull Request is closed and/or merged in GitHub, the environment associated with it should be removed.
6. In all cases (master, staging and pull request environments), if an environment doesn't exist then it should automatically be created. If an environment does already exist, changes should be pushed to it (it should not create a new one).
7. Deployment times for new test instances and for updates to any existing instances should be under 5 minutes.

## Serverless configuration requirements

1. The serverless configuration should be able to take options - such as the hostname or if a CDN should be enabled or not - as environment variables, to keep code duplication and keep complexity down.
2. The production and staging serverless instances should include a CloudFront CDN.
3. Pull Request environments should not include a CloudFront CDN. A CF CDN can take ~40 minutes to provision and this is unacceptably long for a PR environment and is something we can live without in most cases. Changes which require testing of the CDN can be done by pushing the release to the `staging` branch.

## GitHub Repository configuration

The following secrets need to be configured in AWS for these workflows to work.

* `AWS_ACCESS_KEY_ID` – AWS Credentials
* `AWS_SECRET_ACCESS_KEY` – AWS Credentials
* `PRODUCTION_HOSTNAME` – e.g. "www.example.com"
* `STAGING_HOSTNAME` – e.g. "stage.example.com"
* `PULL_REQUEST_DOMAIN` – e.g. "test.example.com" will result URLs like "pr-1.test.example.com"

Note:

The AWS Key/Secret need to be associated with an account that has appropriate permissions to deploy/delete CloudFront Distributions, SSL certificates, S3 Buckets, Gateway and Lambda functions and IAM roles (serverless automatically creates IAM roles with limited privileges which the application will run under).
