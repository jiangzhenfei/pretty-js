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
### 一行代码拷贝数组(在很多框架都是这么实现的)
```js
var beCopyArr = [1,2,3,4,5]
var newCopyArr = beCopyArr.slice()
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















