//Header-----------------------------------------------------------------------------------
//PACKAGE IMPORTS
var bodyParser = require('body-parser');
const vhost = require("vhost");
var fs = require('fs');
var fileupload = require("express-fileupload");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
require('dotenv').config()

//HELPERS
const emailHelper = require('./helpers/emailHelper');
const domain = process.NODE_ENV === "prod" ? "merchantreferral.partner" : "mysite.localhost";
const app = express(),
      test = express()
      // zimmer = express(),
      // promovet = express(),
      // bfcu = express(),
      // fcsb = express(),
      // signature_bank = express()

require('./routes/test')(test);
// require('./routes/zimmer')(zimmer);
// require('./routes/promovet')(promovet);
// require('./routes/bfcu')(bfcu);
// require('./routes/fcsb')(fcsb);
// require('./routes/signature_bank')(signature_bank);

//FRONT END 
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('etag', false)
test.set('view engine', 'ejs');
// zimmer.set('view engine', 'ejs');
// promovet.set('view engine', 'ejs');
// bfcu.set('view engine', 'ejs');
// fcsb.set('view engine', 'ejs');
// signature_bank.set('view engine', 'ejs');

//EXTRAS
app.use(cookieParser());
app.use(fileupload());
app.use(bodyParser.json({limit:'100MB'}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(session(
  { secret: '0dc529ba-5051-4cd6-8b67-c9a901bb8bdf',
    resave: false,
    saveUninitialized: false,
    cookie:{
      maxAge:6000**2
    } 
}));

//SUB DOMAINS
//Wild card subdomain for testing, catches any subdomain
app.use(vhost(`*.${domain}`, test));
// app.use(vhost(`zimmer.${domain}`, zimmer));
// app.use(vhost(`promovet.${domain}`, promovet));
// app.use(vhost(`bfcu.${domain}`, bfcu));
// app.use(vhost(`fcsb.${domain}`, fcsb));
// app.use(vhost(`signaturebank.${domain}`, signature_bank));


const SERVER_PORT = process.env.PORT || 8081;
app.use((req, res, next) => {
  console.log(req.subdomains)
  res.set('Cache-Control', 'no-store')
  next()
})

//END HEADER ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Subdomain controller is under routes/test.js
//TEST Routes
app.get('/', async function(req,res){
  res.send('There is no subdomain') 
})


// app.get('/referrer/:id', async function(req,res){
//   getEmployeeByID(req.params.id)
//   req.session.referralid = req.params.id
//   res.redirect('/')
// })

// app.get('/session/destroy', function(req, res) {
//   req.session.destroy();
//   res.status(200).send('ok');
// });

// app.post('/', async function(req,res){
//     var referralID = req.session.referralid ? req.session.referralid : req.body.referringagent
//     console.log(referralID)
//     var data = {
//       companyname: req.body.companyname,
//       contactname: req.body.contactname,
//       phone: req.body.phone,
//       email: req.body.email,
//       referringagent: getEmployeeByID(referralID) 
//     }
//     var file;
//     file = req.files.filename;  
//     emailHelper.referralForm(data, file).then(response => res.status(200).render('pages/forms_referralformsuccess')).catch(e => console.log(e))
//   })

// app.get('/login',  async function(req,res){

//   var protocol = process.env.NODE_ENV === 'prod' ? 'https' : 'http'

//   //-Redirect URI's will specify the platform type to be handled correctly
//   //Send Microsoft redirect uri to helper (MS.1)
//   var msRedirectUri = protocol + '://' + req.get('host') + '/redirect?platform=ms'
//   msHelper.init(msRedirectUri)
//   //Send Google redirect uri to helper (GO.1)
//   var goRedirectUri = protocol + '://' + req.get('host') + '/redirect?platform=go'
//   googleHelper.init(goRedirectUri)
//   res.render('pages/login')
// })

// app.get('/auth', async function(req,res){

//   //Get Microsoft auth URL then redirect user to it to log on (MS.2)
//   if(req.query.platform === 'ms'){
//     msHelper.generateAuthUrl().then(url => res.redirect(url))
//   }
//   //Get Google auth URL then redirect user to it to log on (GO.2)
//   if(req.query.platform === 'go'){
//     res.redirect(googleHelper.generateAuthUrl())
//   }
// })

// app.get('/redirect', (req, res) => {
//   let date_ob = new Date();
//   let y = date_ob.getFullYear(),
//       d = ("0" + date_ob.getDate()).slice(-2),
//       mm = ("0" + (date_ob.getMonth() + 1)).slice(-2),
//       h = date_ob.getHours(),
//       m = date_ob.getMinutes(),
//       s = seconds = date_ob.getSeconds()

//   // CASE: If a user is not authenticated and the user is trying a access a specific page with a direct link the 
//   //user will be redirected to the login page and "lastRequested" will save that url to redirect to after authenticated
//   var lastRequested = req.session.lastRequested || '/home'

//   //Both platforms will return back to this /redirect route with query "?platform=go OR ?platform=ms"
//   //This switch case will handle each accordingly and create a session.
//   switch(req.query.platform){
//     //Get User information with helper and create session (MS.3 FINAL)
//     case 'ms':
//       msHelper.getUserProfile(req.query.code).then(async (response) => {
//             req.session.access_token = response.accessToken;
//             req.session.id_token = response.idToken;
//             req.session.name = response.account.name
//             req.session.email = response.account.username
//             await authHelper.getDept(response.account.name).then(department => req.session.department = department)
//             req.session.platform = 'ms'
//             // console.log(req.session)
//             console.log(`${req.ip} has logged on successfully at ${y +"-"+ d +"-"+ mm +" "+ h+":"+m+":"+s}`)
//             res.redirect(lastRequested);
//         }).catch((error) => {
//             console.log(error);
//             res.status(500).send(error);
//         });
//         break
//     //Get User information with helper and create session (GO.3 FINAL)
//     case 'go':
//       googleHelper.getUserProfile(req.query.code).then( (userProfile)=>{
//         req.session.access_token = userProfile.tokens.access_token;
//         req.session.id_token = userProfile.tokens.id_token;
//         req.session.name = userProfile.user.name
//         req.session.email = userProfile.user.email 
//         req.session.department = 'Sales'
//         req.session.platform = 'go'
//         // console.log(req.session)
//         console.log(`${req.ip} has logged on successfully at ${y +"-"+ d +"-"+ mm +" "+ h+":"+m+":"+s}`)
//         res.redirect(lastRequested)
//       }).catch((error) => {
//         console.log(error);
//         res.status(500).send(error);
//       });
      
//       break
//     default:
//       res.render('pages/404')
//   }
// });

// app.get('/logout', function(req,res){
//   req.session.destroy();
//   res.redirect('/')
// })

app.get('*', function(req, res){
    res.status(404).render('pages/404');
});

app.listen(SERVER_PORT);
console.log(`...*Listening on PORT: ${SERVER_PORT}*...`);