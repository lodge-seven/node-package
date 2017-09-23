var async = require('async');
var fs = require('fs');

// 串型任务 这个是执行两个异步，1完成，2完成之后再写业务，有一个先后顺序
// 每一个callback执行会将结果保存起来，执行下一步调用，直到结束所以调用，最终的回调执行时，队列里的异步调用保存的结果以数组方式传入，这个作者的解答很完美了不需要自己再组织语言阐述，灰常好
async.series([
    function (callback) {
        fs.readFile('./../协程/demo1_getting_started.js', 'utf-8', callback);
    },
    function (callback) {
        fs.readFile('./../协程/demo2_github_text.js', 'utf-8', callback);
    }
], function (err, result) {
    /* console.log(result[0]);
    console.log(result[1]); */
})