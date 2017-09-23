// 用法
/*
    node-fetch：node版的window.fetch，一个轻量的异步请求
    yield 退让 十分形象，当执行到yield引导的函数时，这个函数是要通过执行执行，否则一直不被启用，余下的函数、操作也不能进行
 */
var fetch = require('node-fetch');

/* 正宗的同步写法，解析url是异步的，但在这里看是同步的，可以直接拿到解析的值，而不去考虑回调 */
function* gen() {
    var url = 'https://api.github.com/users/github';
    var result = yield fetch(url);//执行多步阶段
    console.log(3, result.bio);
}

var g = gen();
var result = g.next();// 指向第一个yield的等式右边
// { value: Promise { <pending> }, done: false }
console.log(1, result)

// 可以携带参数到yield等式的左边，作为返回值来用，这个是正确但没有意义的。这里的fetch内部含有promise
/* var result = g.next({ login: 'github', bio: 'hahahahahah.' });
console.log(2, result)// 2 { value: undefined, done: true } */
result.value.then(function (data) {
    console.log(1, data);
    // var r = g.next(data);// 指向第一个yield的等式左边
    return data.json()// 这里还有一层，这一层数据并不是完整的，可能还在查取中，并未结束data请求
}).then(function (data) {
    console.log(data)
    var r = g.next(data);// 指向第一个yield的等式左边
})