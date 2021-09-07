//BFCU ROUTES
const fs= require('fs')
let rawdata = fs.readFileSync('db/employees.json');
let employees = JSON.parse(rawdata);

module.exports = function(app){
    app.get('/', async function(req,res){
        req.session.destroy();
        var test = JSON.stringify(employees)
        // console.log(test)
        res.render('pages/bfcu_agent',{
          data: test
        })
    })
}