import { APIGatewayTokenAuthorizerEvent, AuthResponse, Context, PolicyDocument } from "aws-lambda";

const { CognitoJwtVerifier } = require('aws-jwt-verify');

const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USERPOOL_ID,
  tokenUse: "id",
  clientId: COGNITO_WEB_CLIENT_ID,
});

const generatePolicy = (principalId, effect, resource): AuthResponse => {
  const tmp = resource.split(":");
  const apiGatewayArnTmp = tmp[5].split("/");


  const updatedResource = tmp[0] + ":" + tmp[1] + ":" + tmp[2] + ":" + tmp[3] + ":" + tmp[4] + ":" + apiGatewayArnTmp[0] + "/*/*";
  const authReponse = {} as AuthResponse;
  authReponse.principalId = principalId;
  if (effect && updatedResource) {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: effect,
          Resource: updatedResource,
          Action: "execute-api:Invoke",
        },
      ],
    };
    authReponse.policyDocument = policyDocument;
  }
  authReponse.context = {
    foo: "bar",
  };
  console.log(JSON.stringify(authReponse));
  return authReponse;
};

export const handler = async (event: APIGatewayTokenAuthorizerEvent, context: Context, callback: any) => {
  const token = event.authorizationToken;

  try {
    const payload = await jwtVerifier.verify(token);
    callback(null, generatePolicy("user", "Allow", event.methodArn));

  } catch (err) {
    callback("Error: Invalid token");
  }
};
