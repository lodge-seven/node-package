/* 
    签名和验证
    不对称加密算法才是王道
    不对称分公钥和私钥
    公钥：开放给别人，用于自身加密
    私钥：保密性。用于自身解密密

    私钥生成：openoss：openssl genrsa -des3 -out server.key 512
    已经生成私钥
    公钥生成也是使用openssl，这块没有中文文章，故不做了
*/

var crypto = require('crypto');
var fs = require('fs');

var pem = fs.readFileSync('key.pem');
var key = pem.toString('ascii');

var cipher = crypto.createCipher('blowfish', key);

