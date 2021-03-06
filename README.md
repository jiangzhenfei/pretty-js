# 优雅的js

### 将字符串中的{{}}转换成对象对应属性,下列 str 转成 my name is fei,my age is 20
```js
let obj = {
    name:'fei',
    age:20
}
let str = `my name is {{name}},my age is {{age}}`
// .*?正则的固定写法，非贪婪匹配，即匹配较少的字符串
let str2 = str.replace(/\{\{(.*?)\}\}/g,function( _, key ){
    return obj[key]
})
```
### 遍历对象少用for in,因为for in 会遍历原型上所有能枚举的属性
```js
let obj2 = {
    name:'fei',
    age:20
}
Object.keys( obj2 ).forEach( ( key )=>{
    console.log( obj2[ key ] )
} )
```
其他的iterable数据可以使用es6的let of
### 对象深拷贝
```js
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
```
### 一行代码拷贝数组(在很多框架都是这么实现的,只是针对内部为基本类型的数组)
```js
var beCopyArr = [1,2,3,4,5]
var newCopyArr = beCopyArr.slice()
```
### 数组去重
```js
uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }
```
### 判断对象是不是简单对象，即直接继承Object，自己定义的构造方法创建的对象则不是
```js
var isPlaintObj = function( o ){
    return Object.getPrototypeOf( o ) === Object.prototype
}
```
### 一行代码求出数组的最大值
```js
var MaxArr = [1,2,3,6,5,9,4,6,8]
var Max = Math.max.apply( window,MaxArr)
console.log(Max)
```
### 手动实现 bind方法，主要原理，具体细节没写
```js
Function.prototype.bind = function( context ){
    return function( ){
        this.apply( context,arguments)
    }
}
```
### slice 的妙用,可以将类数组转成数组以及引发的思考
```js
var likeArr = {
    '0':'fei',
    '1':20,
    '2':'so easy',
    length:3
}
var realArr = [].slice.call( likeArr )
console.log( realArr )//["fei", 20, "so easy"]
```
请思考下列问题
```js
var likeArr = {
    '0':'fei',
    '2':'so easy',
    length:3
}
var realArr = [].slice.call( likeArr )
console.log( realArr )//打印啥，相信你已经知道slice怎么实现了
```
### 箭头函数深入理解
```js
var name = 'fei'
function People(name){
    this.name = name
}
People.prototype.say =()=>{
    console.log(this.name)
}
var p = new People('jiao')
p.say()//打印是啥 答案是fei
```
要想知道箭头函数具体指向谁只要
```js
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
```
### Promise简易实现 为了简便只是考虑resolve
```js
function Promise( fn ){
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
        state = 'fulfilled';
        value = newValue;
        setTimeout(function () {
            callbacks.forEach(function (callback) {
                handle(callback);
            });
        }, 0);
    }
    fn(resolve);
 }
```
### reduce的使用
```js
//求下列数组总和
var sumArr = [1,2,6,7,3,2,45,6,4]
var s = sumArr.reduce( ( pre, cur )=> pre + cur )
console.log( s )
```
如何求数组对象某个值得总和
```js
//如下数组想得出数组对象的cpu使用总和
var addArr = [
    {id:1,cpu:2},
    {id:2,cpu:1},
    {id:3,cpu:5},
    {id:4,cpu:4}
]
//传统的方式
function getCpuTotal(arr){
    var sum = 0;
    arr.forEach( (v)=>{
        sum += v.cpu
    } )
    return sum;
}
console.log( getCpuTotal(addArr))
//使用reduce
function getCpuTotal2(pre,cur){
    return pre + cur.cpu;
}
var t = addArr.reduce( getCpuTotal2, 0 )
console.log( t )
```
### 优雅的for循环
```js
let arr = [1,2,3,4];
let i = arr.length;
while( i-- ){
    console.log( arr[ i ] )
}
```
### 实现继承
```js
function Animal( name ) {
    this.name = name
}
Animal.prototype.say = function(){
    console.log(this.name)
}

function Dog( ){
    Animal.apply(this,arguments)
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```
### 日期格式转化

```js
/** 
* 对Date的扩展，将 Date 转化为指定格式的String 
* 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符 
* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
* eg: 
* (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
* (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04 
* (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04 
* (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 
* (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18 
*/ 
Date.prototype.pattern=function(fmt) { 
    var o = { 
        "M+" : this.getMonth()+1, //月份 
        "d+" : this.getDate(), //日 
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时 
        "H+" : this.getHours(), //小时 
        "m+" : this.getMinutes(), //分 
        "s+" : this.getSeconds(), //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds() //毫秒 
    }; 
    var week = { 
        "0" : "\u65e5", 
        "1" : "\u4e00", 
        "2" : "\u4e8c", 
        "3" : "\u4e09", 
        "4" : "\u56db", 
        "5" : "\u4e94", 
        "6" : "\u516d" 
    }; 
    if(/(y+)/.test(fmt)){ 
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    } 
    if(/(E+)/.test(fmt)){ 
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]); 
    } 
    for(var k in o){ 
        if(new RegExp("("+ k +")").test(fmt)){ 
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
        } 
    } 
    return fmt; 
}
var date = new Date(); 
console.log(date.pattern("yyyy-MM-dd EEE hh:mm:ss")); 
```
### 删除p标签的空标签或者只含有<br/>标签的
```js
// 删除空白空格，标签[\s\r\n]表示换行，空格，回车字符
function removeEmpty( str ){
    var regx = /<p\s*>[\s\r\n]*<br\/>[\s\r\n]*<\/p>/ig;
    var resolveStr = str.replace(regx,"");
    return resolveStr;
}
```
### 监听页面滚动跳滚动到某些元素时候触发的想要的函数，变滚动，页面的tab不断切换
```js
/**
 * 
 * @param {需要监听的元素选择器} elements 
 * @param {处理每个符合条件的元素下标} callback 
 */
var scrollCallBack = function(elements, callback){
    if( !Array.isArray( elements ) ) {
        throw "elements needs Array";
    }
    //获取所以真实dom
    let domArr = elements.map( (v) =>{
        return document.querySelector(v)
    })
    var installDom = null;
    var resolve = function(){
        if( domArr[0] && domArr[0].getBoundingClientRect().top > 0 ){
            callback( 0 )
            installDom = 0;
            return;
        }
        for( var i = 0; i < domArr.length; i++ ){
            let dom = domArr[ i ];
            let nextDom = domArr[ i + 1 ];
            let domTop = dom.getBoundingClientRect().top;
            /* 假设存在下一个元素，当前<0,下一个大于0 */
            if( nextDom ){ 
                let nextDomTop = nextDom.getBoundingClientRect().top;
                if( domTop <= 0 && nextDomTop > 0) {
                    if( installDom === i ){ //滚动过程中符合条件的元素没变则直接退出函数
                        return;
                    }
                    callback( i )
                    installDom = i;
                    break;
                } 
            }else{ /* 不假设存在下一个元素，当前元素<0 */
                if( domTop <= 0 ){
                    if( installDom === i ){ //滚动过程中符合条件的元素没变则直接退出函数
                        return;
                    }
                    callback( i )
                    installDom = i;
                    break;
                }
                
            }
        }
    }
    
    window.addEventListener('scroll',()=>{
        // 保持和浏览器刷新频率一致，减少滚动的方法的过度触发
        requestAnimationFrame(resolve);
    })
}
//在页面中使用
scrollCallBack([
    '#goods-item0',
    '#goods-item1',
    '#goods-item2',
    '#goods-item3'
], index => {
    // index 代表是该元素在数组中的下标
})
```
### IntersectionObserver实现的图片懒加载，兼容性不好，在手机端低版本的安卓不兼容
```js
lazyLoad = function ( element ) {
    const io = new IntersectionObserver(callback)// 实例化 默认基于当前视窗})  

    // 将图片的真实url设置为data-src src属性为占位图 元素可见时候替换src

    function callback(entries){  
        entries.forEach((item) => { // 遍历entries数组
            if(item.isIntersecting){ // 当前元素可见
                item.target.src = item.target.dataset.src + '?imageView2/0/w/200/h/200'  // 替换src
                io.unobserve(item.target)  // 停止观察当前元素 避免不可见时候再次调用callback函数
            }   
        })
        }
    setTimeout(()=>{
        let imgs = document.querySelectorAll( element )
        imgs.forEach((item)=>{  // io.observe接受一个DOM元素，添加多个监听 使用forEach
            io.observe(item)
        })
    },200)
}
```
```html
<img :data-src="item.logoUrl" class="text" v-for="item in data"/>
```
```js
// 在页面中使用,在数据返回后并且最好在nextTick中执行，应为此时是可以拿到dom元素了
lazyLoad("[data-src]");
```












