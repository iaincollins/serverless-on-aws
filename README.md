# serverless-pull-request-environments-with-github-actions
An example of Serverless pull request environments automatically created/removed using GitHub Actions

The purpose of this report is to develop a sample config to cater for the following use cases, to provide on-demand Pull Request serverless environments on AWS, using GitHub Actions.

## Functional requirements

1. When a change is pushed to master on GitHub, the master branch should be deployed to production - this should be to an existing instance, if there is one, otherwise a new instance should be created.
2. When Pull Request is raised in GitHub, the branch associated with it should be deployed and a comment left on the Pull Request with a link to the instance.
3. When a branch associated with a Pull Request is updated, changes should be pushed to the existing instance and a comment on the PR with the time it was updated.
4. When a Pull Request is closed in GitHub the serverless environment created for it should be removed.

## Serverless configuration requirements

1. The serverless configuration should be able to take options - such as the hostname - as environment variables.
2. The production serverless configuration should include a CloudFront distribution configuration.
3. Pull Request environments should not include a CloudFront distribution.
