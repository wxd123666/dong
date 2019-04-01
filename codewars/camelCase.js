String.prototype.camelCase=function(){
    return this.split(" ").map(req=>{
       return req.slice(0,1).toUpperCase()+req.slice(1)
    }).join("");
}
//别人的方法
//   String.prototype.camelCase = function () {
//     return this.trim().replace(/(?:^|\s+)(\w)/g, (_, c) => c.toUpperCase())
//   }
console.log("camel case method".camelCase());