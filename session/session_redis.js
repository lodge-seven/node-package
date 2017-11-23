/*
    session存入redis实现负载均衡或者分布式
    用到express框架，redis
*/
var express = require('express');
var session = require('express-session');
// 实例化对象 
var redisStore = require('connect-redis')(session);

var app = express();


// 连接到redis ttl是过期时间
var config = {
    'cookie': {
        'maxAge': 600000
    },
    'sessionStore': {
        'host': '121.201.67.222',
        'port': '6379',
        'pass': 'zyd123456',
        'db': 1,
        'ttl': 1800,
        'logErrors': true
    }
}

app.use(session({
    name: 'lodge',
    secret: 'lo-go',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: config.cookie,
    store: new redisStore(config.sessionStore)
}));

// 新的检验方法
app.use(function (req, res, next) {
    if(!req.session) {
        return next(new Error('出错'));
    }
    console.log(req.session);
    next();
});

app.get('/', function(req, res){
    // console.log(req)
    // req.session.ddd = null;
    res.end(req.session.ddd);
}); 

app.listen(1234);