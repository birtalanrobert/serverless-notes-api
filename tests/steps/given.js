'use strict';

const AWS = require('aws-sdk');
AWS.config.region = 'eu-central-1';
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.an_authenticated_user = async () => {
  const userPoolId = process.env.USER_POOL_ID;
  const clientID = process.env.CLIENT_ID;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  const params = {
    UserPoolId: userPoolId,
    ClientID: clientID,
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  const user = await cognito.adminInitiateAuth(params).promise();

  return user;
};