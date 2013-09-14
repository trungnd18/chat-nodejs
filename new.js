/**
* Created by TrungNguyen
* Date: 7/9/13
*/
var   http        = require('http')
    , fs          = require('fs')
    , socketIO    = require('socket.io')
    , express = require('express')
    , app = express()
    , port = process.env.PORT || 8080
    , ip= process.env.IP || '127.0.0.1'
    , routes = require('./controllers') 
    , mongo = require('mongoskin'); // include thư viện mongodb
var conn = mongo.db('admin:trung18082016@paulo.mongohq.com:10040/quac');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.set('view engine','jade');
app.set('views', __dirname + '/views');
app.get('/', routes);
app.get('/about', routes.about);
app.get('/chat', routes.about);
app.use(function(req, res){
    res.render('404.jade',{url:req.url});
});
app.use(function(error, req, res, next){
    console.log(error);
    error ? res.render('500.jade') : next();
});
var server      = http.createServer(app).listen(port, ip, function(){console.log('Server running at %s:%s', ip, port)})
var io          = socketIO.listen(server);
var run = function(socket,request){
    
    var endpoint = socket.handshake.address;
    var address_client = endpoint.address+ ":" + endpoint.port;
    var count=endpoint.port;
    conn.collection('chat').find({}).limit(40).toArray(function(err, items){
        socket.emit('oldchat',items);
    });
    conn.collection('online').find({}).limit(40).toArray(function(err, items){
        socket.emit('user_online',items);
    });
    var user_online = {
        'user': "user "+count,
        'ip': address_client
    };
    conn.collection('online').insert(user_online, {safe:true}, function(err, result) {
            });
    socket.emit('startup', 'Welcome to Chat demo');
    socket.broadcast.emit('user_connect',{user :"user "+count, ip:address_client });
    socket.on('client_send',function(data){
            var doc1 = {
                'user': data.username,
                'message': data.message,
                'ip': address_client,
                'date': data.date
            };
        conn.collection('chat').insert(doc1, {safe:true}, function(err, result) {
            });
        socket.broadcast.emit('server_send',{user :data.username,message:data.message, ip:address_client,date:data.date} );
    })
    socket.on('disconnect', function() {
        console.log("User "+count+" disconect");
        conn.collection('online').remove( { 'user' :  "user "+count } )
        socket.broadcast.emit('user_disconnect', {'user' :"user "+count, ip:address_client });
    });
}
io.set('match origin protocol', true);
io.set('origins', '*:*');
//io.set('log level', 1);
io.sockets.on('connection', run);
io.sockets.on('disconnect', function(socket) {
    console.log('you are disconnect');
})

