#我的word

```html
<div>
  <h2>34</h2>
第一个
</div>
```
```sql
select * from table where io limit 1,10
```
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

####promise
```javascript
Promise.all([
  $.ajax(url:"arr.json",dataType:"json"),
  $.ajax(url:"arr2.json",dataType:"json"),
  $.ajax(url:"arr3.json",dataType:"json")
]).then(success=>{console.log(success)},err=>{})
```

|map|reduce|filter|forEach
