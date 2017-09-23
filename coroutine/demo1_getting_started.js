/*
    协程：多线程相互合作
    es6之前没有协程，它在es6上的实现是generator（迭代器），交出函数执行权
 */

/*  
    function* gen(x) {
        var y = yield x + 3;
        return y;
    } 
 */

//  var g = gen(1);
// 不会返回结果3，而是返回指针的对象
//  console.log(g);
//  var result1 = g.next();
//  var result2 = g.next(3);
//  调用next函数，指针指向下一个yield 
//  console.log(1, result1);
//  console.log(2, result2);
// { value: 4, done: false } value是返回值，done是还有下一阶段（t/f）

/*
    对于抛出的错误也可以进行结构分离 
 */

 function* gen(x) {
     try {
         var y = yield x + 2;
     } catch (e) {
         console.log(e);
     }
 }

 var g = gen(1);
 var s = g.next();
 console.log(s)
 
//  g.throw('出错');