const http=require("http");

let server=http.createServer((req,res)=>{
    let a=10;
   // console.log(a);

    res.end();
});

server.listen("3000",()=>console.log("3000"));