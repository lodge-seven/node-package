/*
    什么叫hash（散列）？
    hash：将任意长度的二进制隐射为固定长度的较小二进制，这个就是hash，一个值对应的hash有一个，散列为一个值的两个以上不同输入，计算上无法实现。
    MAC：消息身份验证代码，hash与签名一起用，对数据进行签名。
    MDC：消息检测代码，用于数据完整性。
*/

/* 
    hash算法
    md5 安全的信息摘要 512位分组
    sha-1 sha256 sha512 160位
*/

/*
    用md5算法散射一个明文
    1 选择算法
    2 用算法加密 hash.update(data) 更新hash内容，流数据可以多次调用
    3 密文输出
        hash.digest(encoding='binary') 计算传入数据的hash
        （二进制，十六进制）hex：16进制 binary：2进制 base64 默认buffer
*/
var crypto = require('crypto');
/* var md5HashMethod = crypto.createHash('md5');
md5HashMethod.update('我的密码是OHOH...longqi');
md5HashMethod.update('你要不要试下啊');
var md5Value = md5HashMethod.digest('base64');
console.log(md5Value); */

/*
    hmac密钥哈希
    指定一个密钥去加密哈希值的函数
    createHmac(algorithm, sign)
    这个自我感觉比平台上的md5好一点
*/
var macHashMethod = crypto.createHmac('md5','任何一个用于加密的签名哦');
var macUpdate = macHashMethod.update('ლ(′◉❥◉｀ლ)');
// console.log(macUpdate);
var macValue = macHashMethod.digest('hex');
console.log(macValue);
