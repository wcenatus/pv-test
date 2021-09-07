//PROMOVET ROUTES
module.exports = function(app){
    app.get('/', async function(req,res){
        res.render('pages/promovet_mainform',{
          id:req.session.referralid
        })
    })
}