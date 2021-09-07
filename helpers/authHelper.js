require('dotenv').config()
const fs = require('fs');

module.exports = {
   isLoggedOn: function (req,res,next){
    if(req.session.name){
      // console.log('Validation middleware')
      next()
    }else{
      //Store last requested url to redirect back to 
      req.session.lastRequested = req._parsedOriginalUrl.path
      console.log(`${req.ip} Was not authenticated for page ${req._parsedOriginalUrl.path}`)
      res.redirect('/')
    }
  },
  isAdmin: function(req,res,next){
    let name = req.session.name
    let rawdata = fs.readFileSync('db/employees.json');
    let employees = JSON.parse(rawdata);
    let status = false
    employees.forEach(element => {
      if(element.full_name.toLowerCase() === name.toLowerCase()){
        if(element.role === 'admin'){
          status = true
        }
      }
    });
    if(status){
      next()
    }else{
      res.status(401).render('pages/401')
    }
  },
  checkRole: function(name){
    let rawdata = fs.readFileSync('db/employees.json');
    let employees = JSON.parse(rawdata);
    let status = false
    employees.forEach(element => {
      if(element.full_name.toLowerCase() === name.toLowerCase()){
        if(element.role === 'admin'){
          status = true
        }
      }
    });
    return status
  },
  getDept: function(name){
    const department = new Promise(async (resolve, reject) =>{
      let rawdata = fs.readFileSync('db/employees.json');
      let employees = JSON.parse(rawdata);
      let department = ''
      employees.forEach(element => {
        if(element.full_name.toLowerCase() === name.toLowerCase()){
          department = element.department
        }
      })
      if(department){
        resolve(department)
      }else{
        reject('No employee found')
      }
    })
    return department
  }
    
};
