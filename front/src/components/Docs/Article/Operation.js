/**
 * 文章相关的操作
 */
import fetchApi from "../../Utils/fetchApi";

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
        });
    // 发起请求结束
}

export default {
    patchUpdateArticle,
}