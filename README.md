# AWS Serverless 

An example of Serverless Next.js app with automatic deploy to production and staging on push to the repo with Pull Request environments automatically deployed when a Pull Request is raised using GitHub Actions.

### Functionality 

1. When a change is pushed to the `master` branch on GitHub, the master branch should be deployed to production environment.
2. When a change is pushed to the `staging` branch on GitHub, the staging branch should be deployed to the staging environment.
3. When a Pull Request is raised in GitHub, the branch associated with it should be deployed and a comment left on the Pull Request with a link to the instance.
4. When code in a branch associated with a Pull Request is updated, changes should be pushed to the existing instance.
5. When a Pull Request is closed and/or merged in GitHub, the environment associated with it should be removed.
6. In all cases (main, staging and pull request environments), if an environment doesn't exist then it should automatically be created. If an environment does already exist, changes should be pushed to it (it should not create a new one).
7. Deployment times for new test instances and for updates to any existing instances should be under 5 minutes.

Note: Spinning up an AWS CloudFront CDN can take ~40 minutes to provision, which this may be unacceptably long for a Pull Request environment. You can work around this by depoying test instances *without* a CDN and using a proxy to handle all requests for a testing domain / subdomain. This is not included in this example.

## GitHub Repository configuration

### Production deployment

The following secrets need to be configured in GitHub for the GitHub Actions workflows to work.

* `AWS_ACCESS_KEY_ID` – AWS Credentials
* `AWS_SECRET_ACCESS_KEY` – AWS Credentials
* `APP_NAME` – An identifier for your app in AWS (lower case letters and hyphens only, e.g. "my-web-app")

For production deployment you will need to specify the following:

* `PRODUCTION_HOSTNAME` – Hostname for production instance (e.g. `www.example.com`)
* `PRODUCTION_SSL_CERT` – SSL certificate name for production instance (e.g. `www.example.com`)

### Staging deployment (optional)

If you want to be able to deploy to a "staging" by pushing to a branch called "staging" (e.g. for integration testing) then you will also need to configure the following environment variables:

* `STAGING_HOSTNAME` – Hostname for staging instance (e.g. `stage.example.com`)
* `STAGING_SSL_CERT` – SSL certificate name for staging instance (e.g. `stage.example.com`)

### Pull Request / test instance deployment (optional)

For test instance deployment you will need to specify the following:

* `TEST_DOMAIN` – Domain name to use for test instances (e.g. specifying `test.example.com` will result in test URLs like `http://pr-1.test.example.com`)
* `TEST_SSL_CERT` – SSL certificate name for tests instances (e.g. `test.example.com`)

### Notes

#### AWS Permissions

The AWS Key/Secret need to be associated with an account that has appropriate permissions to deploy/delete CloudFront Distributions, update DNS, SSL certificates, S3 Buckets, Gateway and Lambda functions and IAM roles (serverless automatically creates IAM roles with limited privileges which the application will run under).

#### SSL Configuration

For this workflow SSL Certificates for staging, production and test should be provisioned in advance, as this step usually requires manual intervention to verify domain ownership as part of the certificate creation process.

While it is possible to full automate provision of SSL certificates within serverless this can be slow. Creating the certificates outside of serverless configuration means you can more quickly and easily tear down and de-deploy environments at any time.

For `*_SSL_CERT` values, simply specify a valid hostname for the certificate and it will automatically find it. If you have a single certificate that supports wildcards for your domain (e.g. if the certificate is valid for `example.com` and `*.example.com`) and you use the same domain in production and testing then you can use the same value of `example.com` for every `*_SSL_CERT` environment variable.
