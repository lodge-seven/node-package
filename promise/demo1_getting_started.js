/*
    有些函数的调用需要用到确定数目的参数，回调cd也算一个，没有的话不会执行？
    promise/deferred 允诺/延期 字面意思也是如此，把一个事件可能出现的情况都考虑到，等待其执行，而不是都传入同一个回调中，即执行异步调用，延迟传递处理
    缓解深度嵌套，多用于一些需要依次执行，有联系事件的场景，如自动化测试环境
 */
  

 //  1 promises/A
/* 
    只有三种状态的一种：未完成态，完成态，失败态
    状态不能任何逆反
    一旦转化，不能更改

    看完之后没觉得有多大卵用，一个响应数据接收要特么50多行代码还自以为写的高级，不敢动不敢动，可能在10层以上的嵌套里会比较好看吧
    而且promise，deferred是抽象的函数，得自己实现代码，有一定的技术难度
 */

var fs = require('fs');
/*  自己的理解：Promise为一个自定义的类（继承自Function），里面有成员变量queue，isPromise
    queue用于保存回调函数
    isPromise调取回调结果

    原型函数then：
    调用此函数，把三个传参传入queue中（参数要求为函数，其意义依次为fulfilledHandler 完成态，errorHandler 失败态，progressHandler 进行态，其中进行态没什么操作）
    ，queue格式为 {fulfilled: Function/error: Function}

    至此供外部调用的接口then暴露出来，可以传入不同状态下的操作，比如说某一事件完成后需要做的事由fulfilledHandler函数执行，若失败的话则执行errorHandler
*/
var Promise = function () {
    console.log('Promise....');
    //  一个队列
    this.queue = [];
    this.isPromise = true;
}

// 写一个原型函数，或者叫属性方法 其为异步方法，会先执行放入handle队列
Promise.prototype.then = function (fulfilledHandler, errorHandler, progressHandler) {
    console.log('进入then....');
    var handler = {};
    if (typeof fulfilledHandler === 'function') {
        handler.fulfilled = fulfilledHandler;
    }
    if (typeof errorHandler === 'function') {
        handler.error = errorHandler;
    }
    this.queue.push(handler);
    return this;
}

/*  Promise内部的函数，实现了Promise实例，则继承了两个成员变量：queue，isPromise 
    原型函数resolve
    接收参数为回调中的结果，拿取存入数组中的第一个回调函数，判断其是否有fulfilled对象，即是否有完成态之后的操作，然后传入回调函数中，把返回值存入实例中存放

    原型函数reject
    同resolve的作用相同，拿取的是失败态的回调，及回调结果

    原型函数callback
    由内部规定何时是成功态，何时为失败态，这里为函数本身的回调处理，fs的基本用法，不用封装也不是不行哦
 */
// 延时会用的
var Deferred = function () {
    console.log('Deferred....');
    /* (property) Deferred.promise: {
        queue: any[];
        isPromise: boolean;
        then: (fulfilledHandler: any, errorHandler: any, progressHandler: any) => any;
    } */
    this.promise = new Promise();
    console.log('this.promise1', this.promise);
    // console.log('this.promise', this.promise) // this.promise Promise { queue: [], isPromise: true }
}

// 完成态，在底层返回函数结果后调用
Deferred.prototype.resolve = function (obj) {
    var promise = this.promise;
    var handler;
    // console.log(promise.queue.shift(), handler);
    // 这里的while条件不是判断而是赋值 shift()方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
    /*  重点：while阻塞主js线程的，（但在这里没有阻塞）。不信的话可以试着做一个测试 使用两个setTimeout即定时，模拟两个异步事件，
        在函数内部都加这个逻辑 => while(当前的时间 - 现在的时间 = 你要阻塞的时间值 ){ 里面放一个打印语句} 
        不过这个是很糟糕的，这段while代码会持续占用CPU,CPU会一直为这段代码服务，直到找到promise.queue.shift()，即第一个回调
    */
    while ((handler = promise.queue.shift())) {
        console.log('取得完成态回调并执行...');
        if (handler && handler.fulfilled) {
            console.log('执行then里回调函数....');
            var ret = handler.fulfilled(obj);//同步？？ ret为回调中的返回值，ret使得readFile2立即操作，内部是个新的实例，
            // Promise { queue: [], isPromise: true }
            // 这里是有返回值且返回为Promise实例时的操作
            if (ret && ret.isPromise) {
                ret.queue = promise.queue;//下一个回调函数
                this.promise = ret; //这一步不是很懂 因为ret.queue就是promise.queue，不用再赋值一次，作者说的一旦检测到新的对象，停止执行，当前的promise对象换成新的对象，将回调转交
                console.log('this.promise2', this.promise);
                return;
            }
        }
    }
}

// 失败态
Deferred.prototype.reject = function (err) {
    var promise = this.promise;
    var handler;
    console.log(promise.queue.shift())
    while ((handler = promise.queue.shift())) {
        console.log('取得失败态回调并执行...')
        if (handler && handler.error) {
            var ret = handler.error(err);
            if (ret && ret.isPromise) {
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }
}

// 回调
Deferred.prototype.callback = function () {
    // 底层调用等待回调
    var that = this;
    return function (err, file) {
        console.log('进入callback....');
        if (err) {
            //reject已经预先存在queue数组里面，所以能调取到
            that.reject(err);
        } else {
            //resolve已经预先存在queue数组里面，所以能调取到
            that.resolve(file);
        }
        // console.log(file);
    }
}

var readFile1 = function (file, encoding) {
    /* (local var) deferred: {
        promise: {
            queue: any[];
            isPromise: boolean;
            then: (fulfilledHandler: any, errorHandler: any, progressHandler: any) => any;
        };
        resolve: (obj: any) => void;
        reject: (err: any) => void;
        callback: () => (err: any, file: any) => void;
    } */
    var deferred = new Deferred(); // promise: Promise { queue: [], isPromise: true }
    // console.log(deferred);
    // 主js线程执行，回调函数异步处理
    console.log('调用readFile1....')
    fs.readFile(file, encoding, deferred.callback());
    //回调在底层 这里是js主线程
    return deferred.promise;
}

var readFile2 = function (file, encoding) {
    var deferred = new Deferred();
    console.log('调用readFile2....')
    fs.readFile(file, encoding, deferred.callback());
    return deferred.promise;
} 

/*
    将API Promise化，量化 smooth：优雅的
    知识点：
        Array为构造函数，arguments是类数组，而Array原型对象上有slice方法
        slice删除下标对应的数组对象返回新的数组，原数组不会删除
        call定义是调用一个对象的一个方法，以另一个对象替换当前对象，对象之前的调用问题，基本语法：obj1.fun.call(obj2,arg1,arg2,....)
        如这里，slice是Array原型对象才有的方法，arguments没有slice方法，所以arguments.slice(0)返回的值
        是错误的，提示没有这个方法，要用的话就只能替换，arguments.slice(0) ==> [].slice.call(arguments，0)
        可以用它来实现继承，某类.call(this, this的参数，可不填)
 */

var smooth = function (method) {
    return function() {
        var deferred = new Deferred();
        // fs.readFile(file, encoding, deferred.callback());
        // Array.slice不存在，slice只存在其原型对象上
        // var s = Array.slice(arguments);
        /* var s =arguments.slice(0);
        console.log('s', s); */

        var args = Array.prototype.slice.call(arguments, 0);// 比[].slice.call()高效，意思为类数组返回一个截取了0下标的新数组，把length属性去掉了
        console.log('arguments', arguments);
        console.log('args', args);
        args.push(deferred.callback());// 然后在新的数组最后加一个函数，即回调
        method.apply(null, args);// apply和call的用法都是替换，参数数量不确定时用apply，null也是对象，没有时就指向本身
        return deferred.promise;
    }
}

//API
var readFile = smooth(fs.readFile);

// 调用readFile1返回一个Promise对象
/*  1 调用readFile1 
    2 内部申明Deferred对象 
    3 内部的内部申明Promise对象

    4'(异步) 调用fs读取文件方法，传参与调用callback函数
    5'(异步) 调用reject函数或者resolve函数

    6 readFile1立刻返回一个Promise实例（无这个实例无法调用到其成员方法）
    7 调用then函数，传入Fuction对象
        fulfilledHandler：
        function (file1) {
            console.log('文件1读取....');
            return readFile1('./../协程/demo2_github_text.js', 'utf-8');
        }

        errorHandler：
        function(err){
            console.log('文件1出错....');
            return readFile1('./../协程/demo2_github_text.js', 'utf-8');
        }

    8 实现第一个readFile1函数的回调函数：reject函数或者resolve函数
    9 第一个函数readFile1('./../协程/demo2_getting_started.js', 'utf-8')调用完毕返回一个新的函数readFile1('./../协程/demo2_github_text.js', 'utf-8')继续步骤1
}
 */


//=======================================================================调用================================================================
/* readFile1('./../协程/demo1_getting_started.js', 'utf-8')

//return之后的结果再做一次then的操作，若无return，再进行一次之前函数的操作
.then(function (file1) {
    console.log('文件1读取....');
    // 在resolve这个内部函数中立刻被返回，此时readFile1还在执行中，但又开始了新一轮函数的执行
    return readFile2('./../协程/demo2_github_text.js', 'utf-8');//返回的函数是已经实现的，或者说已经被调用的
}, function(err){
    console.log('文件1出错....');
    return readFile2('./../协程/demo2_github_text.js', 'utf-8');
})
//以结果再进行异步
.then(function (file2) {
    console.log('文件2读取....')
}, function(err){
    console.log('文件2出错....');
}) */
//=======================================================================调用================================================================

readFile('./../协程/demo1_getting_started.js', 'utf-8')
.then(function(file1) {
    return readFile('./../协程/demo2_github_text.js', 'utf-8');
})
.then(function (file2) {
    console.log('文件读取....');
})