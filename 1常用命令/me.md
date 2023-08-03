打开mingodb

1,第一种
sudo mongod

2,第二种
cd /usr/local/mongodb/bin/
sudo ./mongod
另打开窗口
cd /usr/local/mongodb/bin/
./mongo
查看数据库列表
> show dbs
查看当前数据库
> db
切换数据库
>use elm
查看数据库的表
>show collections
数据库支持哪些方法
>db.help()
数据库表支持哪些方法
>db.admin.help()  //admin为表名
查看表内容
>db.admin.find()

////

```


linux
复制  cp -r dir1 dir2
根目录 /usr 和 /root 是同一级别
nginx    /usr/local/nginx/conf/nginx.conf

打开端口号
iptables -A INPUT -ptcp --dport  端口号 -j ACCEPT

iptables -L -n --line-number 可以显示规则和相对应的编号

重启nginx  
cd /usr/local/nginx/sbin
./nginx -s reload      service nginx restart
停止nginx
./nginx -s stop
启动nginx
./nginx -c /usr/local/nginx/conf/nginx.conf 

nginx 301
server {
    listen       443 ssl;
    server_name  example.com;
    return       301 https://www.example.com$request_uri;
}

server {
    listen       443 ssl;
    server_name  www.example.com;
    ...
}
```
apache
Apache的主配置文件：/etc/httpd/conf/httpd.conf
service httpd start 启动

service httpd restart 重新启动

service httpd stop 停止服务

```
git命令

##添加
git add 目录
git commit -m "注释"
git push
##删除
git rm -r --cached 目录
git commit -m "注释"
git push

解决冲突 https://www.trinea.cn/dev-tools/git-skill/
git stash
git pull
git stash pop
git diff -w cn/trinea/appsearch/MainActivity.java

```
phpmyadmin
sudo vi /etc/httpd/conf.d/phpMyAdmin.conf

```
mysql
mysql -u root -p

设置root帐户的密码

mysql_secure_installation

权限设置

GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.1.9' IDENTIFIED BY '123456' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON . TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;
flush privileges;


```node
centOs 安装node
yum install -y wget
下载
wget https://nodejs.org/dist/v9.3.0/node-v9.3.0-linux-x64.tar.xz
     https://nodejs.org/dist/v10.16.0/node-v10.16.0-linux-arm64.tar.gz
     https://nodejs.org/dist/v10.16.0/node-v10.16.0-linux-arm64.tar.xz
解压
tar -xvf node-v9.3.0-linux-x64.tar.xz
unzip xxx.zip
全局安装
ln -s /usr/local/src/node-v9.3.0-linux-x64/bin/node /usr/bin/node
ln -s /usr/local/src/node-v9.3.0-linux-x64/bin/npm /usr/bin/npm

node -v
npm -v

node版本控制 nvm   https://www.jianshu.com/p/ebb0e97eff83
1.安装git  # sudo apt-get install git
2.        # curl https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash

3.         #nvm --version
           #nvm ls-remote node
           #nvm install v10.10.0

```
```pm2  
安装出错，

npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.1.3 (node_modules/pm2/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.1.3: wanted 

通常npm安装的时候有警告可以直接忽略。这里其实也是。但是执行pm2命令就一直提示不存在pm2这个时候就需要把pm2配置全局变量了。

ln -s /usr/local/src/node-v8.9.0-linux-x64/bin/pm2  /usr/local/bin/pm2

````


lnmp
https://lnmp.org/install.html   安装教程

/usr/local/nginx/conf/vhost   虚拟网站配置目录

添加ssl证书  （https://www.wangjingxian.cn/qita/222.html）
1,申请证书 -》下载 -》上传

2，lnmp ssl add      (配置虚拟空间 ssl)
   server {
        listen 443;
        server_name f.falvbang.com;
        ssl on;
        root /home/wwwroot/www;
        index index.html index.htm;
        ssl_certificate   cert/2946294_f.falvbang.com.pem;
        ssl_certificate_key  cert/2946294_f.falvbang.com.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        location / {
            root /home/wwwroot/www;
            index index.html index.htm;
        }
    }
3，开启443端口
后台=》云服务器ESC=》实例=》管理=》本实例安全组=》配置规则=》添加安全组规则

```
#scss

npm install node-sass sass-loader -D
{  
    test: /\.scss$/,
    loaders: ["style", "css", "sass"]
}

```
2019-05-13

改php.ini    改db.config.php

php版本   权限

this.$axios({
              methods:"GET",
              url:"http://f.xiaodong110.com/app_api/v9/login.php",
              data:{mobile:this.loginForm.username,pwd:this.loginForm.password}
            }).then((res)=>{
              console.log(res);
            })

Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Methods: PUT,POST,GET,DELETE,OPTIONS
Access-Control-Allow-Origin: http://127.0.0.1:8088
Content-Length: 2
Content-Type: text/plain; charset=utf-8
Date: Tue, 14 May 2019 09:32:55 GMT
Etag: W/"2-nOO9QiTIwXgNtWtBJezz8kv3SLc"
Keep-Alive: timeout=58
Server: nginx
X-Powered-By: Express





server {
    listen 80;
    server_name reader.xiaodong110.com;

    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:8088;
    }
}




$allow_origin = array(
    'http://www.falvbang.com',
    'http://falvbang.com'
);

if(in_array($origin, $allow_origin)){
    header('Access-Control-Allow-Origin:'.$origin);
}


location / {
                index  index.html  index.htm index.php;
                #autoindex  on;
                if (!-e $request_filename) {
                        rewrite ^(.*)$  /index.php?s=/$1 last;
                        break;
                }
        }

        <script type="text/javascript">
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  window.location.href = "http://m.icc2020.cn/";
} else {
  window.location.href = "http://www.icc2020.cn/";
}
</script>

http://icc2020.cn/wp-content/plugins/contact-form-7/includes/js/scripts.js