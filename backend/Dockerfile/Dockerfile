FROM python:3.8-alpine

WORKDIR /data/www/

# 安装mysqlclient,pillow,uwsgi需要这些依赖
RUN apk add --no-cache --virtual .fetch-deps musl-dev gcc mysql-dev curl vim \
        && apk add --no-cache jpeg-dev zlib-dev linux-headers
        # && apk del --no-network .fetch-deps

COPY ./requirements.txt ./
RUN pip install -r requirements.txt

# 设置环境变量
ENV LANG='C.UTF-8' PYTHONIOENCODING='UTF-8' TZ='Asia/Shanghai' KANBAN_DEVELOP_DB="kanban" \
        # 数据库相关的环境变量
        MYSQL_HOST="127.0.0.1" MYSQL_USER="root" MYSQL_PASSWORD="" MYSQL_PORT=3306 \
        # 七牛图片上传相关的环境变量
        QINIU_UPLOAD_TOOGLE="" QINIU_ACCESS_KEY="" QINIU_SECRET_KEY="" QINIU_BUCKET="" QINIU_BUCKET_DOMAIN=""

# COPY Pipfile* ./
# RUN pip install pipenv && pip install --system --deploy

ADD ./source.tar.gz ./source/
COPY ./run.sh ./

VOLUME [ "/data/www/"]

# 开发环境，便捷部署，直接python manage.py runserver 运行
# CMD ["python", "manage.py" "runserver 0:8080"]
CMD ["/bin/sh", "-c", "/data/www/run.sh"]
# CMD ["python3"]
