/* 
    这里是加密传给前端的数据，防止那种前端信息被盗取甚至篡改传回后台的事件
    参考黄总代码加上自己的理解
*/
var url = require('url');
const crypto = require('crypto'); // 密码


/**
 * 通过url解析成数组
 * urlPath: url?a1=b1&a2=b2&... 
 * result: [ a1: b1, a2: b2, ...]
 * @param {any} urlPath
 * @returns urlArr
 */
module.exports.urlAlterArr = function(urlPath) {
    // url.parse 参数1为链接，第二个参数为真时，输出的query属性类型为json，否则为字符串
    var url_argument = url.parse(urlPath,true).query;
    urlArr = [];
    for (var key in url_argument) {
        urlArr[key] = url_argument[key];
    }
    return urlArr;
}

/**
 * 传入明文，输出
 * 用md5算法生成哈希加密是无法进行解密的
 * 
 * @param {any} content 
 */
module.exports.md5 = function(content) {
    // 用md5算法来创建hash实例
    var md5 = crypto.createHash('md5');
    md5.update(content);// 要加密的明文
    var d = md5.digest('hex');// hash值固定位数 这里转成16进制
    // console.log(d);
    return d;
}

console.log('wqqwewqeqwe');
console.log(this.md5('agdjghdkhdkjadjjsdgjagdydjhbxnkggjkjhkjkdasdjahgdjbxbdgjag'));
console.log('wqqwewqeqwe');

/**
 * aes对称密码加密
 * 比较能理解 A用密钥key加密，B用密钥key解密
 * A加密得到的一串密文暗示，把它交给B，B通过同样的密钥去解密
 * 
 * @param {any} data 原文 
 * @param {any} key 密钥
 */
var keys = 'FHDJsSDJSEbnbnRGSDFGz13602567887';
module.exports.aesEncodeCipher = function (data, key) {
    var datastr = typeof(data) === 'string'? data : JSON.stringify(data);
    // 进行一次编码
	var buf = new Buffer(datastr);
    var base64String = buf.toString('base64');
    // 加密 实例化一个cipher对象
    var cipher = crypto.createCipheriv('aes-256-ecb', key, '');
    var cipherChunks = [];
    cipherChunks.push(cipher.update(base64String, 'utf8', 'hex'));
    cipherChunks.push(cipher.final('hex'));
    // cipher.update(base64String, 'utf8', 'hex');
    // var cipherResult = cipher.final('hex');
    // return cipherResult;
    console.log(cipherChunks);
    return cipherChunks.join('');
}

/**
 * aes解密
 * 
 * @param {any} data 
 * @param {any} key 
 */
module.exports.aesDecodeCipher = function (data, key) {
    // 解密数组对象
    var cipherChunks = [data]; 
    var plainChunks = [];
    // 解密的decipher类实例化对象
    var decipher = crypto.createDecipheriv('aes-256-ecb', key, '');
    for (var i = 0;i < cipherChunks.length; i++) {
        plainChunks.push(decipher.update(cipherChunks[i], 'hex', 'utf8'));
    }
    plainChunks.push(decipher.final('utf8'));
    // 16进制的密码解密中...
    // var dec = decipher.update(data,'hex','utf8');
    // dec = decipher.final('utf8');
    // 加密的密文用base64进行了转码，这里要还原成之前的明文
    var base64buf = new Buffer(plainChunks.join(''), 'base64');
    var enString = base64buf.toString();
    return enString;    
}

// var s = this.urlAlterArr('http://localhost:3000/?_m=admincon&_n=update_program&func=user');
// console.log(this.aesEncodeCipher('我爱你',keys));
// console.log(this.aesDecodeCipher('fa5f26e906e25ffd4c27d66b8e9ce097',keys));


/*
    网址与其携带参加密
    由于加密的重要点在key上，有了key与相应的加密算法，才能解密，这里为了保护key值不被解析，生成的key为md5的32位数字。
    1 加密的步骤：拿取url携带参，转换成数组，取出里面某个参数
    2 获取md5加密的参数
    3 加密   
*/
// var urlPath = 'http://localhost:3000/?_m=admincon&_n=user&_f=update","修改用户资料","60a376dc15f2b0c55714d8eb3a56d7c1","91cb1ec0f2c51994d88e2d229f7c3e94';
var urlPart = 'http://localhost:3000?_m=admincon&_n=user&_f=update';
var urlArr = this.urlAlterArr(urlPart);
// console.log(urlArr);
// 获取key 用md5加密一道url为依据的密钥 网络密文的结构是 文件方法名 + 文件名 + 文件方法名对应的按钮的名称
var md5Key = this.md5(urlArr._m + '.' + urlArr._n + '.' + urlArr._f);
// console.log(md5Key); // b644f98af58f84becfbd0ee75495ae0d
// 用密钥上锁我们的暗号 用密文给你心爱的人表白
var ourCipher = '我爱你ლ(′◉❥◉｀ლ)';
// console.log(ourCipher);
// 编个码
ourCipher = encodeURIComponent(ourCipher);
// ourCipher = decodeURIComponent(ourCipher);
console.log(ourCipher);
var cipherHash = this.aesEncodeCipher(ourCipher, md5Key);
// 这个加密不能加特殊符号，解密不全
 console.log(cipherHash); // 05d1f28d3e3cdd5035503ac56e36cd52
// 现在反向解码
// 需要的密钥：b644f98af58f84becfbd0ee75495ae0d，需要的密文：05d1f28d3e3cdd5035503ac56e36cd52
var cipherAnalysis = this.aesDecodeCipher('fc19eb0e5e584c26f0b18a370bae951e69bfefdf59839dae9aad346af6d06bf2a49d1a5642645f6e515f260b24f2916a6cdb467ea100c66483447aff98e553c47012d0b66fe53bb1a9ff9706096adc07101a86fc7b3419358e2bca1134f1ef94977a7a686ddf52fa8ceb1044db1d464dc6f228d48108e4d89632f09023b6cc88', md5Key);
cipherAnalysis = decodeURIComponent(cipherAnalysis);
console.log(cipherAnalysis);


