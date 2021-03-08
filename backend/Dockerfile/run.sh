#!/bin/sh

# 直接执行python manage.py runserver
# cd /data/www/source && python manage.py runserver 0:8080 || python3

cd /data/www/source/kanban && \
 cp ./settings.product.py settings.py && \
  cp ./urls/main.product.py ./urls/main.py;

# 收集静态文件
cd /data/www/source && python manage.py collectstatic --noinput

ls /data/www/source/uwsgi.ini || cat >> /data/www/source/uwsgi.ini << EOF
[uwsgi]
http = 0.0.0.0:8080
chdir = /data/www/source
wsgi-file = kanban/wsgi.py
processes = 4
threads = 2
stats = 127.0.0.1:8090

static-map = /static=/data/www/static
static-map = /media=/data/www/media
static-index = index.html
buffer-size = 32768
master = true

EOF

# css js media image
mkdir /data/www/static/css
mkdir /data/www/static/js
mkdir /data/www/static/image
mkdir /data/www/static/media

cp -rf /data/www/source/static/manifest.json  /data/www/static/
cp -rf /data/www/source/static/css/* /data/www/static/css/
cp -rf /data/www/source/static/js/* /data/www/static/js/
cp -rf /data/www/source/static/image/* /data/www/static/image/
cp -rf /data/www/source/static/media/* /data/www/static/media/

# 启动服务：端口是8080的
uwsgi /data/www/source/uwsgi.ini
