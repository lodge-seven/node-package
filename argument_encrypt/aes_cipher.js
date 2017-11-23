/* 
    cipher 暗号
    用的还是node自带的本地模块crypto   
*/

/* 
    加密
    这里的暗号可以解密成明文，密钥是双方都共有的
    所以为对称加密，密钥保存给双方，给一个已知的算法。
    crypto.createCipher(algorithm, key)
    cipher.update(data, 输入的data的编码, 输出的数据的编码)input：utf8 ascii binary output：binary base64 hex
    cipher.final(encoding) 返回剩余的加密内容 输出编码是：binary ascii utf8

    aes块有最大长度，超过这个长度就会把之前的替换掉重新开始加密，这样就有n额aes块，update这个函数生成的值会一直叠加，之后要用final去返回一个完整的加密值
    这里除了+=，还可以用数组的push方法
*/
var crypto = require('crypto');
var cipherMethod = crypto.createCipher('aes-256-ecb', 'token-seven');
var end = ''; 
end += cipherMethod.update('我爱你ლ(′◉❥◉｀ლ)', 'utf8', 'base64');
end += cipherMethod.final('base64');
console.log(end);

/* 
    解密
    用密文和密钥解密
    由于加密的密文也是n个aes块，所以需要一段一段的解密
*/
var decipherMethod = crypto.createDecipher('aes-256-ecb', 'token-seven');
var start = '';
start += decipherMethod.update(end, 'base64', 'utf8');
start += decipherMethod.final('utf8');
console.log(start);