const http=require("http");
const fs=require("fs");
const socket=require("socket.io");
const mysql=require("mysql");
const regs=require("./libs/regs");

let db=mysql.createPool({
  host:"localhost",
  user:"root",
  password:"root",
  database:"github",
  port:"8889"
});
let server=http.createServer((req,res)=>{

  fs.readFile(`www${req.url}`,(err,data)=>{
     if(err){
       res.writeHeader("404");
       res.write("Not Found");
     }else{
       res.write(data);
     }
     res.end();
  });
});

server.listen("3002",()=>{console.log("3002")});

//let socket=[];
let wsServer=socket.listen(server);
wsServer.on("connection",sock=>{
  let cur_username="";
  let cur_userId=0;
   sock.on("reg",(user,pass)=>{
     if(!regs.username.test(user)){
       sock.emit("reg_ret",1,"用户名不符合规范");
     }else if(!regs.password.test(pass)){
       sock.emit("reg_ret",1,"密码不符合规范");
     }else{
       db.query(`select id from table_user where username='${user}'`,(err,data)=>{
         if(err){
           sock.emit("reg_ret",1,"数据库有错");
         }else if(data.length>0){
           sock.emit("reg_ret",1,"用户名存在");
         }else{
           db.query(`insert into table_user (username,password,tel) values('${user}','${pass}',0)`,(err,data)=>{
             if(err){
               sock.emit("reg_ret",1,"数据库有错");
             }else{
               sock.emit("reg_ret",0,"注册成功");
             }
           });
         }
       });
     }
   });

   sock.on("login",(user,pass)=>{
     if(!regs.username.test(user)){
       sock.emit("login_ret",1,"用户名不符合规范");
     }else if(!regs.password.test(pass)){
       sock.emit("login_ret",1,"密码不符合规范");
     }else{
       db.query(`select id,password from table_user where username='${user}'`,(err,data)=>{
         if(err){
           sock.emit("login_ret",1,"数据库有错");
         }else if(data.length==0){
           sock.emit("login_ret",1,"用户名不存在");
         }else if(data[0].password!=pass){
           sock.emit("login_ret",1,"密码错误");
         }else{
           db.query(`update table_user set tel=1 where username='${user}'`,(err)=>{
             if(err){
               sock.emit("login_ret",1,"数据库有错");
             }else{
               sock.emit("login_ret",0,"登陆成功");
               cur_userId=data[0].id;
             }
           });

         }
       });
     }

   });

   sock.on("msg",txt=>{
       
   });
   sock.on("disconnect",()=>{
        db.query(`update table_user set tel=0 where id='${cur_userId}'`,(err,data)=>{
           if(err){
             console.log("数据库有错");
           }
           cur_username="";
           cur_userId=0;
        });
   });
});
