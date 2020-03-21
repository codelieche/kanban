#!/bin/bash
# 打包前端代码
echo "$(date +"%F %T"): 开始打包前端代码"

REPLACE_FILES=("^main.*.chunk.js$" "^2.*.chunk.js$" "^main.*.chunk.css$" "^2.*.chunk.css$")

# 开始执行构建、替换url、出错就退出
yarn run build && \
    gsed -i 's#http://127.0.0.1:9000##g' ./static/js/*.js \
    || (echo "$(date %"%F %T"): 构建失败！！！" && exit 1);

# 执行替换
for i in ${REPLACE_FILES[@]}
do
    echo "    替换文件：$i"
    OLD_JS_FILE=`ls ../backend/static/**/ | egrep "$i"`
    NEW_JS_FILE=`ls build/static/**/ | egrep "$i"`

    # 替换js文件
    if [ -n "${OLD_JS_FILE}" ];then
      params="s/${OLD_JS_FILE}/${NEW_JS_FILE}/g"
      echo "    替换参数：${params}"
      gsed -i $params ../backend/templates/index.html &&  \
        echo "执行sed替换：${params}成功" || echo "替换失败"
      echo ""
    else  
        echo "    $i:匹配到的文件为空"
    fi
done

# 复制新的文件去后端
rm -rf ../backend/static/js/*.chunk.js && echo "    删除老的*.chunk.js文件成功"
rm -rf ../backend/static/css/*.chunk.css && echo "    删除老的*.chunk.css文件成功"
cp -rf build/static/js/*.chunk.js ../backend/static/js/ && echo "    复制新的*.chunk.js文件成功"
cp -rf build/static/css/*.chunk.css ../backend/static/css/ && echo "    复制新的*.chunk.css文件成功"

echo "$(date +"%F %T"): 打包结束"

exit 0;