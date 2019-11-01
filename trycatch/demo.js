try{
    console.log('进入');
    require('fs').stat('SOME',function readCallback(err, content){
        // 并没有抛出错误来，因为异常的捕获在回调之前就结束了
        // 当Node抛出不可捕捉的异常，就丢失了当前环境的堆栈，导致不能正常内存回收。
        if(err){
            throw err;
        }
    });
}catch(e){
    console.log('异常', e);
} finally {
    console.log('离开');
}