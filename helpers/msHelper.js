const msal = require('@azure/msal-node');

const config = {
    auth: {
        clientId: process.env.MS_CID,
        //https://login.microsoftonline.com/common for multitenant use
        authority: "https://login.microsoftonline.com/cwams.com",
        clientSecret: process.env.MS_SECRET
    },
      system: {
          loggerOptions: {
              loggerCallback(loglevel, message, containsPii) {
              },
              piiLoggingEnabled: false,
              logLevel: msal.LogLevel.Verbose,
          }
      }
  };
  var redirectUri;

const pca = new msal.ConfidentialClientApplication(config);
module.exports={
    init:  function(url){
        redirectUri = url
    },
    generateAuthUrl: async function(){
        const authCodeUrlParameters = {
            scopes: ["user.read"],
            redirectUri: redirectUri
          };
        var url = ''
        return await pca.getAuthCodeUrl(authCodeUrlParameters)
    },
    getUserProfile: function(code){
        const tokenRequest = {
            code: code,
            scopes: ["user.read"],
            redirectUri: redirectUri,
        };
        return pca.acquireTokenByCode(tokenRequest)
    }
}