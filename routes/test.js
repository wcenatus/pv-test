//BFCU ROUTES
const fs= require('fs')
let rawdata = fs.readFileSync('db/employees.json');
let employees = JSON.parse(rawdata);

module.exports = function(app){
    app.get('/', async function(req,res){
        res.send(req.subdomains[0])
    })
}