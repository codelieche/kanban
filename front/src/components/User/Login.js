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
    const url = "http://127.0.0.1:9000/api/v1/account/login";
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
        let next = params.get("next");
        // 如果next为null或者next为/user/login那么就跳转到首页
        if (!next || next === "/user/login") {
          next = "/";
        }
        // 跳转去首页
        // console.log('即将跳转', next);
        // this.props.history.push(next);
        var url = window.location.origin + next;
        window.location.href = url;
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
      <Layout style={{ height: "100vh" }}>
        <Row style={{ height: "100vh" }}>
          <Col xs={{ span: 20, offset: 2 }} lg={{ span: 6, offset: 9 }}>
            <div
              className="logo"
              style={{ textAlign: "center", marginTop: "100px", 
              backgroundColor:"#4A90E2", padding: "30px 20px", borderRadius: "10px 10px 0 0" }}
            >
              <img
                src="https://www.codelieche.com/static/images/logo.svg"
                alt="Logo"
              />
            </div>

            <Form onSubmit={this.handleSubmit} onFinish={this.handleSubmit} name="baseForm"
            ref={this.formRef} className="login-form">
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
                  Login in
                </Button>
              </FormItem>

              <FormItem>
                <Row>
                  <Col span={12} className="login-form-change">
                    <Link to="">
                      change password
                    </Link>
                  </Col>
                  <Col span={12} className="login-form-forget">
                    <Link to="">
                      forget password
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
