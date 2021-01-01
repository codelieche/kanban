/**
 * 用户退出登录，然后跳转到登录页
 */

import React from "react";

import { Redirect } from "react-router-dom";

import { message } from "antd";
import fetchApi from "../Utils/fetchApi";

export default class Logout extends React.Component {
  componentDidMount() {
    this.logout();
  }

  logout = () => {
    const url = "http://127.0.0.1:9000/api/v1/account/logout";
    fetchApi.Get(url)
      .then(data => {
        //  console.log(data);
        if (data.status === "success") {
          message.success("退出登录成功");
        }else{
          // console.log(data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return <Redirect to="/user/login" push={false} />;
  }
}
