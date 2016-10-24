# Serverless GraphQL Starter Kit

A simple starter kit for getting GraphQL working with API Gateway, Lambda, DynamoDB using the Serverless framework.

# Install
`npm install`

Make sure you copy the `config.json.copy` to `config.json` and update the AWS configuration.
You will also need to update the region attribute inside `serverless.yml`

# Running locally
`sls webpack serve`

# Deploy
`sls deploy`

# Test
Create a test user in the database
`sls webpack invoke -f graphql -p create-user.json`

Get the list of users from the database
`sls webpack invoke -f graphql -p get-users.json`
