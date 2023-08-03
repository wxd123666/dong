const Router=require('koa-router');
const db=require('../libs/database');
const fs=require('fs');
const uuid=require('uuid/v4');
const verfi=require('../libs/verfi_code');


let router=new Router();

router.options('*', async ctx=>{
  ctx.body='ok';
});

//collect
router.get('collect/:type/:data/', async ctx=>{
  let {type, data}=ctx.params;

  await db.insert('collect_table', {type, data});

  ctx.body={OK: true};
});

//restaurant
//http://localhost:8090/api/restaurant/0/8/
router.get('restaurant/:page/:size/', async ctx=>{
  let {page,size}=ctx.params;

  if(isNaN(page)){
    page=0;
  }

  if(isNaN(size)){
    size=8;
  }

  ctx.body=await db.query(`SELECT * FROM restaurant_table LIMIT ${page*size},${size}`);
});

//http://localhost:8090/api/restaurant/:id/
router.get('restaurant/:id/', async ctx=>{
  let {id}=ctx.params;

  ctx.body=(await db.query(`SELECT * FROM restaurant_table WHERE restaurant_id='${id}'`))[0];
});

//menu
//http://localhost:8090/api/menu/163462/
router.get('menu/:restaurant_id/', async ctx=>{
  let {restaurant_id}=ctx.params;
  let rows_menu=await db.select('menu_table', '*', {restaurant_id});
  let rows_food=await db.select('food_table', '*', {restaurant_id});

  let menus={};
  rows_menu.forEach(row=>{
    menus[row.menu_id]=row;
    menus[row.menu_id].foods={};
  });

  //
  rows_food.forEach(row=>{
    menus[row.menu_id].foods[row.food_id]=row;
  });

  ctx.body=menus;
});

//cart
//http://localhost:8090/api/cart/157105028/2/
router.get('cart/:item_id/:count/', async ctx=>{
  if(!ctx.token){
    ctx.status=400;
    ctx.body='token required';
  }else{
    let {item_id, count}=ctx.params;

    //1.有没有
    let rows=await db.select('cart_table', 'ID,count', {item_id, token: ctx.token});

    //添加
    if(rows.length==0){
      await db.insert('cart_table', {token: ctx.token, item_id, count});
    }else{
      let row=rows[0];

      await db.update('cart_table', row.ID, {count: Number(row.count)+Number(count)});
    }

    ctx.body={OK: true};
  }
});

//delete http://localhost:8090/api/cart/157105028
router.delete('cart/:item_id/', async ctx=>{
  if(!ctx.token){
    ctx.status=400;
    ctx.body='token required';
  }else{
    let {item_id}=ctx.params;

    await db.delete('cart_table', {item_id, token: ctx.token});

    ctx.body={OK: true};
  }
});

//image
router.get('image/:id/', async ctx=>{
  let {id}=ctx.params;
  ctx.body=fs.readFileSync(`images/${id}`);
});

//token
//GET http://localhost:8090/api/token
router.get('token', async ctx=>{
  let token=uuid().replace(/\-/g, '');

  await db.insert('token_table', {token, expires: Math.floor((Date.now()+20*86400*1000)/1000), user_ID: 0});

  ctx.body=token;
});

//
router.post('user/', async ctx=>{
  let {username, password, code}=ctx.request.fields;
  let sessionCode=await ctx.session.get(ctx.token, 'code');

  if(code.toLowerCase()!=sessionCode){
    ctx.body={OK: false, msg: '验证码不对'};
  }else{
    let rows=await db.select('user_table', '*', {username: username.toLowerCase()});

    if(rows.length==0){
      await db.insert('user_table', {username: username.toLowerCase(), password});

      ctx.body={OK: true};
    }else{
      ctx.body={OK: false, msg: '此用户已存在'};
    }
  }
});

router.get('user/:username/:password', async ctx=>{
  let {username, password}=ctx.params;

  let datas=await db.select('user_table', '*', {username: username.toLowerCase()});

  if(datas.length==0){
    ctx.body={OK: false, msg: '此用户不存在'};
  }else if(datas[0].password!=password){
    ctx.body={OK: false, msg: '用户名或密码有误'};
  }else{
    let datas2=await db.select('token_table', 'ID', {token: ctx.token});

    let user_ID=datas[0].ID;
    let token_ID=datas2[0].ID;

    await db.update('token_table', token_ID, {user_ID});

    ctx.body={OK: true};
  }
});

//
router.get('verfi_code', async ctx=>{
  const seed="abcdefhjkmnprstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ2345678";
  arr=[];

  for(let i=0;i<5;i++){
    arr.push(seed[Math.floor(Math.random()*seed.length)]);
  }

  let code=arr.join('');

  let {w, h, token}=ctx.request.query;
  ctx.response.body=await verfi(w, h, code);

  await ctx.session.set(token, 'code', code.toLowerCase());
});



module.exports=router.routes();
