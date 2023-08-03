const mongoClient=require("mongodb").MongoClient;

mongoClient.connect("mongodb://127.0.0.1:27017/",(err,client)=>{
   if(err){
     console.log("err"+err);
   }else{
     let db=client.db("test");
     db.collection("user_table").find({},(err,data)=>{
       if(err){
         console.log(err);
       }else{
         console.log(data);
       }
     });
   }
});
