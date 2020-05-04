#!/bin/bash
# 部署项目

# 1. 准备变量
HOST=test.kanban.codelieche.com
USER=www
TARGET_DIR="/data/www/kanban.codelieche.com"

# 2. 同步代码到服务器
# 2-1：查看服务器上的目录文件
ssh $USER@$HOST "ls ${TARGET_DIR}"

# 2-2：推送代码
rsync -rltgD ./* --exclude "apps/**/migrations/00*.py" \
   --exclude "kanban/settings.py" \
    --exclude "kanban/urls/main.py" \
    --exclude "__pycache__" \
   --exclude "tmp/*" \
   ${USER}@${HOST}:${TARGET_DIR}/source/

# rsync -rltgD ./* --exclude "apps/**/migrations/00*.py" \
#     --exclude "kanban/settings.py" \
#      --exclude "kanban/urls/main.py" \
#     --exclude "tmp/*" \
#     www@test.kanban.codelieche.com:/data/www/kanban.codelieche.com/source/


ssh $USER@$HOST "ls ${TARGET_DIR}/source"


# 第2步：查看
ssh $USER@$HOST "ls ${TARGET_DIR}"

# 重启服务
ssh $USER@$HOST "echo `date` && bash /data/www/kanban.codelieche.com/reload.sh"

# 查看uwsgi进程
ssh $USER@$HOST "ps aux | grep uwsgi"
#ssh $USER@$HOST  "ls ~"
#ssh $USER@$HOST "ls ~"
