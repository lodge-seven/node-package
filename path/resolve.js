var path = require('path');
//resolve用于处理路径字符串，把它拼成一个绝对路径，这个在不同操作系统上使用，减少人工自己拼装的成本
var dir = path.resolve('f:/dd/aaa/sas','../Application');
console.log(dir);