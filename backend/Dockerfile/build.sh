#!/bin/bash
# 构建kanban镜像脚本

# 第1步：准备环境变量
NAME=kanban
TAG=v1
echo "$(date +"%F %T"): 开始" 
SCRIPT_DIR=$(cd $(dirname ${BASH_SOURCE[0]}); pwd)
echo $SCRIPT_DIR

# 第2步：生成requirements.txt
( cd $SCRIPT_DIR && cd ../ && ls Pipfile; export PIPENV_IGNORE_VIRTUALENVS=1; \
    pipenv lock --requirements > ./requirements.txt \
    &&  mv requirements.txt ./Dockerfile) \
    || (echo $PWD;echo "$(date +"%F %T"): 生成requirements.txt出错！！！"; exit 1)

# 第3步：复制代码文件到source
# 执行上面的步骤的时候，是需要回到当前目录的
(cd $SCRIPT_DIR; tar -czf source.tar.gz ../kanban ../apps ../static ../templates ../manage.py ../Pipfile*) \
    || (echo "+(date %"%F %T"): 打包source.tar.gz出错！！！"; exit 1)

# 第4步：构建镜像
# 4-1：进入目录
cd $SCRIPT_DIR;

# 4-2：构建镜像
docker build . -t $NAME:$TAG || (echo "$(date +"%F %T"): 构建镜像失败！！！" && exit 1)

# 4-3: 给镜像打标签
docker tag "$NAME:$TAG" "codelieche/$NAME:$TAG"

# 4-4: 查看镜像
docker images | grep $NAME

# 4-5: 推送【请手动推送，不自动执行】
# docker push "codelieche/$NAME:$TAG"

# 第5步：创建测试容器
# 5-1: 启动容器
# docker run -itd --name kanban-t1 kanban:v1
# docker run -itd --name kanban-t1 $NAME:$TAG

# 5-2：创建个测试容器，并进入
# docker run -it --rm --name kanban-v1 kanban:v1 /bin/sh



echo "$(date +"%F %T"): 结束！" 