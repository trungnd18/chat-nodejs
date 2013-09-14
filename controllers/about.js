module.exports = function(req, res){
    res.render('about.jade', {message:'Hello from express, again! this is about page'});
}