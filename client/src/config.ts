// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'xm3n31pdmf'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'lawrencep.us.auth0.com',            // Auth0 domain
  clientId: 'ZL9l8DiOKsl90N5wLlRtOxHKYCtG9AMG',          // Auth0 client id
  //callbackUrl: 'http://localhost:3000/callback'
  callbackUrl: 'http://172.26.143.172:3000/callback'
}
