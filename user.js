const http=require("http");
const mysql=require("mysql");
const socket=require("socket.io");
const fs=require("fs");
const url=require("url");
const regs=require("./libs/regs");

let db=mysql.createPool({host:"localhost",user:"root",password:"root",database:"github",port:"8889"});
//let db=mysql.createPool({host:"qdm19942836.my3w.com",user:"qdm19942836",password:"Add521commit",database:"qdm19942836_db"});
//let db=mysql.createPool({host: '192.168.0.10', user: 'root', password: 'root', database: 'test'});

let server=http.createServer((req,res)=>{
  let {pathname,query}=url.parse(req.url,true);
  if(pathname=="/reg"){
    console.log("注册1",query);
    let {user,pass}=query;
    if(!regs.username.test(user)){
      res.write(JSON.stringify({code:1,msg:"用户名不符合规范"}));
      res.end();
    }else if(!regs.password.test(pass)){
      res.write(JSON.stringify({code:1,msg:"密码不符合规范"}));
      res.end();
    }else{
    db.query(`select id from table_user where username='${user}'`,(err,data)=>{
    //  console.log(err);
      if(err){
        res.write(JSON.stringify({code: 1, msg: '数据库有错'}));
        res.end();
      }else if(data.length>0){
        res.write(JSON.stringify({code:1,msg:"用户名已存在"}));
        res.end();
      }else{
        db.query(`insert into table_user (username,password,tel) values('${user}','${pass}',0)`,err=>{
          if(err){
            res.write(JSON.stringify({code:1,msg:"数据库有错"}));
            res.end();
          }else{
            res.write(JSON.stringify({code:0,msg:"注册成功"}));
            res.end();
          }
        });
      }
    });
  }
}else if(pathname=="/login"){
   let {user,pass}=query;
   if(!regs.username.test(user)){
     res.write(JSON.stringify({code:1,msg:"用户名不符合规范"}));
     res.end();
   }else if(!regs.password.test(pass)){
     res.write(JSON.stringify({code:1,msg:"密码不符合规范"}));
     res.end();
   }else{
     db.query(`select id,password from table_user where username='${user}'`,(err,data)=>{
       console.log("data:"+data);
        if(err){
          res.write(JSON.stringify({code:1,msg:"数据库有错"}));
          res.end();
        }else if(data.length==0){
          res.write(JSON.stringify({code:1,msg:"用户名不存在"}));
          res.end();
        }else if(data[0].password!=pass){
          res.write(JSON.stringify({code:1,msg:"密码错误"}));
          res.end();
        }else{
          db.query(`update table_user set tel=1 where id=${data[0].id}`,(err,data)=>{
            if(err){
                res.write(JSON.stringify({code:1,msg:"数据库有错"}));
                res.end();
            }else{
                res.write(JSON.stringify({code:0,msg:"登陆成功"}));
                res.end();
            }
          });
        }
     });

   }
  }else{
    fs.readFile(`www${req.url}`,(err,data)=>{
      if(err){
         res.write("err");
      }else{
         res.write(data);
      }
      res.end();
    });
  }

});


server.listen(3002);
