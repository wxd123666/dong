root@39.106.51.149's password:
Last login: Sun Sep  6 16:31:28 2020 from 123.115.149.9

▽
server
    {
        listen 80;
        #listen [::]:80;
        server_name www.derong.cn derong.cn m.derong.cn webchat.derong.cn union.derong.cn;
        index index.html index.htm index.php default.html default.htm default.php;
        root  /home/wwwroot/derong;

        include rewrite/none.conf;
        #error_page   404   /404.html;

        # Deny access to PHP files in specific directory
        #location ~ /(wp-content|uploads|wp-includes|images)/.*\.php$ { deny all; }
        location / {
                index index.html index.htm index.php;
                #autoindex on;
                if (!-e $request_filename) {
                        rewrite ^(.*)$ /index.php?s=/$1 last;
                        break;
                }

        }
        include enable-php.conf;

                                                                                        