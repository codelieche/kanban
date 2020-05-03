/**
 * Django后台的资源相关的操作
 */
import fetchApi from "../../Utils/fetchApi";

import {
    message
} from "antd";
/**
 * 通过patch方法更新对象：
 * 1. appLabel: Django后端对应的app Label
 * 2. model: Django后端Model的名字，小写
 * 3. objectID: 更新的对象ID
 * 4. data: 需要更新的内容
 * 5. callback: 更新操作完成后的回调函数
 */
export const patchUpdateObject = (appLabel, model, objectID, data, callback) => {
    // 参数校验
    if ( !(!!appLabel && !!model && !!objectID) ){
        console.log("参数传递错误：", appLabel, model, objectID);
    }

    // 1. 生成api的url
    let url = `/api/v1/${appLabel}/${model}/${objectID}`;

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
    patchUpdateObject: patchUpdateObject,
}