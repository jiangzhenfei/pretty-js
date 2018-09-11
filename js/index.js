/**
 * 优雅的js
 */


/**
 * 将字符串中的{{}}转换成对象对应属性
 * 下列str转成 `my name is fei,my age is 20`
 */
let obj = {
    name:'fei',
    age:20
}
let str = `my name is {{name}},my age is {{age}}`
// .*?正则的固定写法，非贪婪匹配，即匹配较少的字符串
let str2 = str.replace(/\{\{(.*?)\}\}/g,function( _, key ){
    return obj[key]
})


/**
 * 遍历对象少用for in,因为for in 会遍历原型上所有能枚举的属性
 */
let obj2 = {
    name:'fei',
    age:20
}
Object.keys( obj2 ).forEach( ( key )=>{
    console.log( obj2[ key ] )
} )


/**
 * 对象深拷贝
 */
function extend( _newObj, obj ){
    var isPlaintObj = function( o ){
        return Object.getPrototypeOf( o ) === Object.prototype
    }
    var isArray = function( arr ){
        return Object.getPrototypeOf( arr ) === Array.prototype
    }
    for ( var key in obj){
        var copy = obj[ key ]
        if( typeof copy === 'object' ){
            if( isPlaintObj( copy ) ){
                var clone = {}
            }
            if( isArray( copy ) ){
                var clone = []
            }
            _newObj[ key ] = extend( clone,copy )
        }else{
            _newObj[ key ] = copy
        }
    }
    return _newObj;
}
var obj3 = {
    name:{
        age:20
    },
    arr:[1,2,3]
}
var t = extend ({},obj3)
obj3.name.age = 11111;
obj3.arr.push(4)
console.log( t )


/**
 * 一行代码拷贝数组
 * 在很多框架都是这么实现的
 */
var beCopyArr = [1,2,3,4,5]
var newCopyArr = beCopyArr.slice()


/**
 * 判断对象是不是简单对象，即直接继承Object，
 * 自己定义的构造方法创建的对象则不是
 */
var isPlaintObj = function( o ){
    return Object.getPrototypeOf( o ) === Object.prototype
}

/**
 * 一行代码求出数组的最大值
 */
var MaxArr = [1,2,3,6,5,9,4,6,8]
var Max = Math.max.apply( window,MaxArr)
console.log(Max)

/**
 * 手动实现 bind方法，主要原理，具体细节没写
 */
Function.prototype.bind = function( context ){
    return function( ){
        this.apply( context,arguments)
    }
}

/**
 * slice 的妙用
 * 可以将类数组转成数组
 */
var likeArr = {
    '0':'fei',
    '1':20,
    '2':'so easy',
    length:3
}
var realArr = [].slice.call( likeArr )
console.log( realArr )//["fei", 20, "so easy"]


/**
 * 箭头函数的深入理解
 */
var name = 'fei'
function People(name){
    this.name = name
}
var _self = this;
People.prototype.say =()=>{
    console.log(_self.name)
}
var p = new People('jiao')
p.say()//打印是啥

/**
 * 实现简易的promise
 * 为了简便值考虑resolve
 */

function Promise(){
    var state = 'pendding',//状态初始化
        value = null,//resolve时候的值将会保存在这里
        callbacks = []//resolve之后要执行的回调

    this.then = function( func ){
        return new Promise( function( resolve ){
            handle( { 
                onFulfilled: func || null,
                resolve:     resolve
            } )
        } )
    }
    function handle(callback) {
        if (state === 'pending') {//pedding状态往数组添加回调
            callbacks.push(callback);
            return;
        }
        //如果then中没有传递任何东西
        if(!callback.onFulfilled) {
            callback.resolve(value);
            return;
        }
        var ret = callback.onFulfilled(value);//执行当前的.then内部的函数
        callback.resolve(ret);//获取的结果触发下一个promise的resolve
    }
    function resolve(newValue) {
        //如果返回的是一个promise（1），那么当前的resolve不会循环执行callbacks，
        //而是往该promise内部。then一个回调，回调就是当前promise正常的resolve，
        //当promise（1）成功，触发当前的resolve，也就触发该ppromise内部的callbacks
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            var then = newValue.then;
            if (typeof then === 'function') {
                then.call(newValue, resolve);
                return;
            }
        }
        state = 'fulfilled';//状态修改
        value = newValue;
        setTimeout(function () {//延迟执行所有的callbacks内部的函数，延迟执行的目的是resolve可能提前触发，但是回调还没注册
            callbacks.forEach(function (callback) {
                handle(callback);
            });
        }, 0);
    }
    fn(resolve);
}