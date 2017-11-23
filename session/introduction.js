/*
    会话组成
    1 浏览器首次访问服务器，服务器创建session对象，里面有cookie这个key，把它发给浏览器
    ===================>
    Session {
    cookie:
    { path: '/',
        _expires: 2017-11-14T04:03:07.397Z,
        originalMaxAge: 3600000,
        httpOnly: true } }
    ===================>

    2 浏览器保存cookie，准备在下一次的请求头对象中携带
    __guid: 111872281.4325706016293389000.1508747746308.2346（360浏览器携带）    
    connect.sid: s%3ARaKr4TPXcxQmnYOczREblhG73xM_-dE9.jeH0bB5Dpqi%2F82PC0o5MTPq78gpb1UUl%2B7c%2FdIsZOPU

    3 下次访问，携带key（cookie），找到对应的session。
    ===================>
    Session {
    cookie:
    { path: '/',
        _expires: 2017-11-14T04:03:19.202Z,
        originalMaxAge: 3600000,
        httpOnly: true },
    user_name: '67',
    user_id: 5,
    user_pid: 3 }
    ===================>

    node模块express-session常用参数
    secret：签名
    name：key（cookie）返值到客户端的名称，默认为connect.sid。
    resave：是否允许客户端并行发送多请求，其中一个请求在另一个请求结束时对session进行修改覆盖。
    saveUninitialized：初始化时是否保存到存储
*/

// 刷新后session时间重置
var express = require('express');
var session = require('express-session');
var app = express();

app.use(session({ secret: '我的快递好久到啊', resave:false, saveUninitialized:false}));


app.get('/', function(req, res, next) {

        // 在app里没找到的 在req中居然找到了 = = 我去 不按常理出牌啊
        console.log('sessionStore');
        console.log(req.sessionStore.sessions);
        // console.log(req.sessionStore.store.stats);
        req.session.views ++;
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.end()
});

app.get('/login', function(req, res, next) {
    req.session.views = 1;
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
});

app.listen(2000); 

