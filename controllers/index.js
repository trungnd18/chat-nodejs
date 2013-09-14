module.exports = function(req, res){
    res.render('index.jade', {message:'Hello from express, this is home page'});
}
 
module.exports.about = require('./about');
module.exports.about = require('./chat');