const http=require("http");
const fs=require("fs");
// let server=http.createServer(function(req,res){
//   if(req.url=="/aaa"){
//     res.write("woshiaaa")
//   }else if(req.url=="/bbb"){
//     res.write("woshibbb")
//   }else if(req.url=="/ccc"){
//     res.write("123456")
//   }
//   res.end();
// });


// fs.readFile("1.html",(err,data)=>{
//   console.log(data);
// });
// fs.writeFile("2.txt","我是一颗boom",err=>{
//   if(err){
//     console.log("22")
//   }
// })
let server=http.createServer((req,res)=>{
  fs.readFile(`www${req.url}`,(err,data)=>{
console.log(data);
    if(err){
      fs.readFile("absd/qq.html",(err,data)=>{
        if(err){
          res.writeHeader("404");
          res.write("404");
        }else{
          res.write(data);
        }
        res.end();
      });
    }else{
      res.write(data);
      res.end();
    }


  });
});

server.listen("3000");
