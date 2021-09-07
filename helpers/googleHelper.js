// import { google } from 'googleapis';
const NodeGoogleLogin = require('node-google-login');
const {google} = require('googleapis')
const { OAuth2Client } = require('google-auth-library');

// var goRedirectUrl = process.env.NODE_ENV === 'prod' ? 'https://aloha.cwams.com/redirect?platform=go': 'http://localhost:8081/redirect?platform=go'

var config ={
  clientID: '',
  clientSecret: '',
  redirectURL: '',
  defaultScope: ''
};
const googleLogin = new NodeGoogleLogin(config);
const authURL = googleLogin.generateAuthUrl()

var defaultScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]

module.exports ={
  init: function(redirectUri){ 
    config.clientID = process.env.GOOGLE_CID,
    config.clientSecret = process.env.GOOGLE_SECRET,
    config.redirectURL = redirectUri,
    config.defaultScope = defaultScope
  },
  createConnection: function() {
    return new google.auth.OAuth2(
      config.clientID,
      config.clientSecret,
      config.redirectURL
    );
  },
  getConnectionUrl: function(auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: defaultScope
    });
  },
  generateAuthUrl: function(){
    const auth = this.createConnection();
    const connectonURL = this.getConnectionUrl(auth);
    return connectonURL
  },
  getUserProfile(code){
    return new Promise(async (resolve,reject)=>{
      try {
        const oAuthClient = await this.createConnection();
        const client = new OAuth2Client(process.env.GOOGLE_CID);
        const tokens = await oAuthClient.getToken(code)
        const {id_token} = tokens.tokens
        // console.log("id_token",id_token);
        const ticket = await client.verifyIdToken({
          idToken: id_token,
          audience: process.env.GOOGLE_CID
        });
        const payload = ticket.getPayload();
        resolve({user: payload, tokens: tokens.tokens})
      } catch (error) {
        reject(error)
      }
    })
  }

}

