function foo(){
    var i = 0; 
    function b() {
        i++;
        console.log(i);
        if(i < 10){
            b();
        }
    }

    function a() {
        return i;
    }
    return {a:a,b:b};
}

var a;
// console.log('b0',b);
// console.log('pro', a);
a = 1;
// 声明式函数
function fnScope(qw,qe) {
    console.log('b1',b);
    console.log('a1',a); // a1 undefined
    
    var a = 'x';
    var b = a + 1;
    console.log('b2',b)
    console.log('a2',a); // a2 x
    return b;
}
// 函数表达式
var fnEquation = function() {
    console.log('a3',a); // a3 undefined
    //var a = 'y';
    var b = a;
    console.log('a4',a); // a4 y
}
// var b = fnScope(1,2);
// console.log('b2', b);
// fnEquation();
//console.log('a5',a); // a5 1

/* var aaa={
    i:2,
    init:function(ba){
        var _this = this ;
        _this.bindEvent();
    },
    bindEvent:function(aa){
    }
}