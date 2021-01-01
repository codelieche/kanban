/**
 * 用户组 添加 页
 */
import React, {useCallback, useContext, useEffect} from "react";

import { message } from "antd";
import fetchApi from "../../Utils/fetchApi";
import { GlobalContext } from "../../Base/Context";

import UserGroupForm from "./Form";

export const GroupAdd = (props) => {
  // 获取全局的setNavData
  const { setNavData } = useContext(GlobalContext);

  useEffect(() => {
    // 设置导航
    setNavData([
      {
        title: "首页",
        icon: "home",
        link: "/"
      },
      {
        title: "用户",
        link: "/user"
      },
      {
        title: "分组",
        link: "/user/group/list"
      },
      {
        title: "添加",
      }
    ])
  }, [setNavData])

  const handleAddSubmit = useCallback(values => {
    // console.log(values);
    // 通过fetch POST添加Group
    const url = "/api/v1/account/group/create";
    fetchApi.Post(url, {}, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      data: values
    })
      .then(responseData => {
        // console.log(data);
        if (responseData.id > 0) {
          // 当data中有id字段，就表示添加成功了，跳转去group的详情页
          props.history.push("/user/group/" + responseData.id);
        } else {
          message.error(JSON.stringify(responseData), 8);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [props.history]);

  return (
    <div className="content">
      <div className="main">
        <div className="title">
          <h4>添加用户组</h4>
        </div>
        <div className="wrap">
          <UserGroupForm handleSubmit={handleAddSubmit} />
        </div>
      </div>
    </div>
  );
}

export default GroupAdd;
