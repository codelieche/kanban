/**
 * 用户验证相关的函数
 */

import fetchApi from "./fetchApi";

function CheckLogined({history, match, location}) {
    // 首先get访问，判断是否成功登陆了
   //  如果登陆了，就返回true，没登陆
   const url = "/api/v1/account/login";
   fetchApi.Get(url)
       .then(data => {
           if(data.logined){
               return true;
           }else{
               // 没有登陆的话，就跳转去login页面
               history.push("/user/login?next=" + location.pathname);
           }
       });
}

 /**
 * 检查用户的权限并修改状态
 * 调用的时候记得绑定bind
 * - permission: 权限名称，eg: task.add_category
 * - stateFieldName: 这个权限在state中的名字，eg: userCanAddCategory
 */
function checkUserPermissionAndUpdateState(permission, stateFieldName) {
   
    let url = "/api/v1/account/permission/check";
    fetchApi.Post(url, {}, {
        data: {permission: permission}
    })
      .then(data => {
        let updateFields = {}
          if (data.result) {
              updateFields[stateFieldName] = true;
          }else{
            updateFields[stateFieldName] = false;
          };
          // 修改状态
          this.setState(updateFields);
      })
        .catch(err => console.log(err));
}

export function checkUserPermission(permission, callback) {
   
    let url = "/api/v1/account/permission/check";
    fetchApi.Post(url, {}, {
        data: {permission: permission}
    })
      .then(data => {
        // let updateFields = {}
        //   if (data.result) {
        //       updateFields[stateFieldName] = true;
        //   }else{
        //     updateFields[stateFieldName] = false;
        //   };
          // 修改状态
          // setState(prevState => {prevState[stateFieldName] = data.result; return prevState});
          // 调用回调函数
          if(typeof callback === "function"){
            // console.log("执行callback", data.result)
            callback(data.result);
          }
      })
        .catch(err => console.log(err));
}

export default CheckLogined;

export {
    CheckLogined,
    checkUserPermissionAndUpdateState
}
