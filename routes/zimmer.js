//ZIMMER ROUTES
const fs= require('fs')
let rawdata = fs.readFileSync('db/employees.json');
let employees = JSON.parse(rawdata);
function getEmployeeByID(id){
    try{
      var agent = employees.find(element => parseInt(element.id) === parseInt(id))
      return agent.full_name
    }catch{
      return null
    } 
}

module.exports= function(app){
    app.get('/', async function(req,res){
        if(req.session.referralid){
          res.render('pages/zimmer_customer',{
            id:req.session.referralid
          })
        }
        else{
          res.redirect('/agent')
        } 
    })
    app.get('/agent', async function(req,res){
        req.session.destroy();
        var test = JSON.stringify(employees)
        // console.log(test)
        res.render('pages/zimmer_agent',{
          data: test
        })
    })     
    app.get('/referrer/:id', async function(req,res){
        getEmployeeByID(req.params.id)
        req.session.referralid = req.params.id
        res.redirect('/')
    })
      
    app.get('/session/destroy', function(req, res) {
        req.session.destroy();
        res.status(200).send('ok');
    });
      
    app.post('/', async function(req,res){
          var referralID = req.session.referralid ? req.session.referralid : req.body.referringagent
          console.log(referralID)
          var data = {
            companyname: req.body.companyname,
            contactname: req.body.contactname,
            phone: req.body.phone,
            email: req.body.email,
            referringagent: getEmployeeByID(referralID) 
          }
          var file;
          // console.log(referral)
          // if(!req.files)
          // {
          //     res.send("File was not found");
          //     return;
          // }
          file = req.files.filename;  
          // console.log(file)
      
          emailHelper.referralForm(data, file).then(response => res.status(200).render('pages/forms_referralformsuccess')).catch(e => console.log(e))
    })
}