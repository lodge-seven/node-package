/* 
    session默认存在内存中，当使用的框架为express。
    请求进入服务器，在路由之前会先调用express的中间件，把session放入中间件中，通过中间件加工后，在路由的req参数中就携带有一些此中间件的调用
    如：req.session req.sessionStore.session
    app.use(function(req,res,text) {  text();})

    session存在内存中以json的形式，其中一些属性是可选的。在调用中间件的时候会进行设置，在第一次请求时，session为空，第二次会携带cookie值在请求中，session不为空
*/

var express = require('express');
var session = require('express-session');

var app = express();
app.use(session({resave: false, saveUninitialized: false, secret: '随便', cookie:{maxAge: 10000}}));

//saveUninitialized设置为false时，如没有添加或修改过req.session，不会再生成session类的值
//resave不知道
app.get('/', function(req, res) {
    /* 
        Session {
        cookie:
        { path: '/',
            _expires: null,
            originalMaxAge: null,
            httpOnly: true } }
    */
    // console.log(req.session);

    /* 
        MemoryStore {
        domain: null,
        _events:
        { disconnect: [Function: ondisconnect],
            connect: [Function: onconnect] },
        _eventsCount: 2,
        _maxListeners: undefined,
        sessions: {},
        generate: [Function] }
    */
    req.session.aaa = '123';
    console.log(req.sessionStore);
    res.end('看清楚了吗 滚。');
});

app.get('/d', function(req, res) {
    console.log(1111);
    console.log(req.sessionStore);
    res.end('滚。'+ req.session.id);
    // 只能删除当前对应的session
    req.session.destroy(function(err) {
        console.log(2222)
    })
});

app.listen(3000);