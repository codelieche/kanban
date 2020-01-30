/**
 * 用户登陆组件
 */
import React, { Component } from "react";
import {Link} from "react-router-dom";
import { Layout, Row, Col, Form, Input, Button, message } from "antd";
import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";

import URLSearchParams from "../Utils/UrlParam";

const FormItem = Form.Item;

class LoginForm extends Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  formRef = React.createRef();

  handleSubmit = (values) => {
    // console.log(values);

    // POST登陆账号
    const url = "/api/v1/account/login";
    // 跨域默认是不传递cookie的，要传递cookies需要设置credential: include
    fetchApi.Post(url, {},
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        data: values
      }
    )
    .then(data => {
      // console.log(data);
      if (data.status === "success" || data.status === true) {
        // 获取next的url
        // 首先获取search参数：?next=/
        const params = new URLSearchParams(this.props.location.search);
        // 获取next的值
        let next = params.get("next", "/");
        // console.log(next);
        // 如果next为null或者next为/user/login那么就跳转到首页
        if (!next || next === "/user/login") {
          // 跳转去首页
          next = "/";
        }
        // console.log('即将跳转', next);
        
        if (typeof next === "string" && next.startsWith("http")){
          window.location.href = next;
        }else{
          // 跳转到当前域名的首页
          var url = window.location.origin;

          if (typeof next === "string"){
            // next是字符类型的，就加上next后就是要跳转的url
            url = window.location.origin + next;
          }
          // 跳转
          window.location.href = url;
        }
      } else {
        message.error("登陆失败:" + data.message, 5);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    try {
      localStorage.reFreshPathname = null;
    } catch (error) {}
  }

  render() {
    // const { getFieldDecorator } = this.props.form;
    return (
      <Layout className="container">
        <Row className="login">
          <Col xs={{ span: 20, offset: 2 }} lg={{ span: 6, offset: 9 }}>
            <div
              className="logo"
              // style={{ textAlign: "center", marginTop: "100px", 
              // backgroundColor:"#4A90E2", padding: "30px 20px", borderRadius: "10px 10px 0 0" }}
            >
              <img
                src="https://www.codelieche.com/static/images/logo.svg"
                alt="Logo"
              />
            </div>

            <Form ref={this.formRef}
              onFinish={this.handleSubmit} name="baseForm"
            className="login-form">
              <FormItem
                name="username"
                rules={[
                  {required: true, message: "请输入用户名"},
                ]}
              >
                  <Input
                    prefix={<Icon type="user" style={{ fontSize: 16 }} />}
                    placeholder="username"
                  />
              </FormItem>

              <FormItem
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                  <Input
                    prefix={<Icon type="lock" style={{ fontSize: 16 }} />}
                    size="large"
                    type="password"
                    placeholder="password"
                  />
              </FormItem>

              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ width: "100%" }}
                >
                  登录
                </Button>
              </FormItem>

              <FormItem 
                // style={{marginBottom: 0}}
              >
                <Row>
                  <Col span={12} className="login-form-change">
                    <Link to="">
                      修改密码
                    </Link>
                  </Col>
                  <Col span={12} className="login-form-forget">
                    <Link to="">
                      忘记密码
                    </Link>
                  </Col>
                </Row>
              </FormItem>
            </Form>

          </Col>
        </Row>
      </Layout>
    );
  }
}

// var Login = Form.create()(LoginForm);
// export default Login;
export default LoginForm;
