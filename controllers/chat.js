module.exports = function(req, res){
    res.render('chat.jade', {title:'Welcome Chat Box'});
    // console.log("trungr"+req.headers['x-client-ip']);
} 