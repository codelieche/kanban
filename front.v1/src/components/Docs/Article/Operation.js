/**
 * 文章相关的操作
 */
import fetchApi from "../../Utils/fetchApi";
import moment from "moment";

import {
    message
} from "antd";
/**
 * 通过patch方法更新文章：
 * 1. 标题
 * 2. 描述
 * 3. 内容
 */
export const patchUpdateArticle = (articleId, data, callback) => {

    // 1. 生成文章的url
    let url = `/api/v1/docs/article/${articleId}`;

    // 2. 发起请求
    fetchApi.Patch(url, {}, {
        data,
    })
      .then(responseData => {
        //   console.log(responseData);
        if(responseData.id > 0){
            // 如果成功了，需要执行callback
            if(typeof callback === "function"){
                // 执行回调函数:把新的值传给callBack
                callback(responseData);
            }
        }else{
            // 出错了
            console.log(responseData);
        }
      })
        .catch(err => {
            console.log(err);
            // 更新出错:判断是否需要保存文章内容
            if(data && data.content){
                // 更新文章内容出错，我们把这个内容保存到localStorage中
                let key = `article_${articleId}_content`
                let articleData = {
                    content: data.content,
                    time: moment().format("YYYY-MM-DD hh:mm:ss"),
                    key
                }
                localStorage.setItem(key, JSON.stringify(articleData));
            }
            if(err && err.status){
                if(err.status === 403){
                    message.error("您无权限", 5);
                }else if(err.status === 404){
                    message.error("404错误", 5);
                }else{
                    message.error(`出现错误：${err.status}`, 5);
                }
            }
            
        });
    // 发起请求结束
}

export default {
    patchUpdateArticle,
}