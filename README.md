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

The following secrets need to be configured in GitHub for the GitHub Actions workflows to work.

* `AWS_ACCESS_KEY_ID` – AWS Credentials
* `AWS_SECRET_ACCESS_KEY` – AWS Credentials
* `APP_NAME` – An identifier for your app in AWS (lower case letters and hyphens only, e.g. "my-web-app")

For production deployment you will need to specify the following:

* `PRODUCTION_HOSTNAME` – Hostname for production instance (e.g. `www.example.com`)
* `PRODUCTION_SSL_CERT` – SSL certificate name for production instance (e.g. `www.example.com`)

For test instance deployment you will need to specify the following:

* `TEST_DOMAIN` – Domain name to use for test instances (e.g. specifying `test.example.com` will result in test URLs like `http://pr-1.test.example.com`)
* `TEST_SSL_CERT` – SSL certificate name for tests instances (e.g. `test.example.com`)

If you want to be able to deploy to a "staging" by pushing to a branch called "staging" (e.g. for integration testing) then you will also need to configure the following environment variables:

* `STAGING_HOSTNAME` – Hostname for staging instance (e.g. `stage.example.com`)
* `STAGING_SSL_CERT` – SSL certificate name for staging instance (e.g. `stage.example.com`)

### Notes

#### AWS Permissions

The AWS Key/Secret need to be associated with an account that has appropriate permissions to deploy/delete CloudFront Distributions, update DNS, SSL certificates, S3 Buckets, Gateway and Lambda functions and IAM roles (serverless automatically creates IAM roles with limited privileges which the application will run under).

#### SSL Configuration

For this workflow SSL Certificates for staging, production and test should be provisioned in advance, as this step usually requires manual intervention to verify domain ownership as part of the certificate creation process.

While it is possible to full automate provision of SSL certificates within serverless this can be slow. Creating the certificates outside of serverless configuration means you can more quickly and easily tear down and de-deploy environments at any time.

For `*_SSL_CERT` values, simply specify a valid hostname for the certificate and it will automatically find it. If you have a single certificate that supports wildcards for your domain (e.g. if the certificate is valid for `example.com` and `*.example.com`) and you use the same domain in production and testing then you can use the same value of `example.com` for every `*_SSL_CERT` environment variable.
