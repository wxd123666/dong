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

##模块化

```javascript nodejs
exports.a=xx;
module.exports={
  a:2,
  b:4
}

require(./)
```
```es6
输出
export{a:2,b:3}
输入
import 变量 from "xx.js"
```


async{

  awit
}


babel

npm run serv


runner.js


webpack



##nginx
若端口未开启先在阿里云开启端口

/usr/local/nginx/sbin/nginx  启动nginx
/usr/local/nginx/sbin/nginx -s reload  重新载入
/usr/local/nginx/sbin/nginx -s stop 停止
/usr/local/nginx/sbin/nginx -s reopen  重启

/usr/local/nginx/conf/nginx.conf  nginx 配置文件
```javascript
   nginx 配置多个node站点
server {
    listen 80;
    server_name a.com;

    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:8082;
    }
}
server {
    listen 80;
    server_name b.com;

    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:8083;
    }

}

```


















//////////
