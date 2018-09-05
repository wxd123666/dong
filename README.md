#我的笔记

markdown
快速打开任何降价预览 ctrl-shift-m
具有持久性宏支持的数学渲染，切换为 ctrl-shift-x

###字符模版

```javascript
let [a,b,c]=[12,1,9];

let url="https://www.xiaodong110.com/blog";
console.log(url.startsWith("https://"));//true
console.log(url.endsWith("blog"))       //true

let a=12;
let b="123";
let html=`<div>
          <span>${a}</span>
          <span>${b}</span>  
         </div>`;
    console.log(html)
```
###面向对象
```javascript
class Zoom{
  constructor(name,long){
    this.name=name;
    this.long=long;
  }
  myName(){
    alert(this.name);
  }
  myLong(){
    alert(this.long);
  }
}
class bigZoom extends Zoom{
  constructor(name,long,csx){
     super(name,long);
     this.csx=csx;
  }
  myCsx(){
    alert(this.csx);
  }
}
let wo=new bigZoom(tiger,200,5+);
console.log(wo.myName());
console.log(wo.myLong());
console.log(wo.myCsx());
```
####promise
```javascript
Promise.all([
  $.ajax(url:"arr.json",dataType:"json"),
  $.ajax(url:"arr2.json",dataType:"json"),
  $.ajax(url:"arr3.json",dataType:"json")
]).then(success=>{console.log(success)},err=>{})
```
###数组
|map|reduce|filter|forEach

###generator
```javascript
  function *show(){
    alert("1");
    yield 12;
    alert("3")
    reture 44;
  }
let gen=show();
let res1=gen.next();
console.log(res1);
let res2=gen.next();
console.log(res2);

```
