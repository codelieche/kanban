/**
 * 修改密码页面
 */
import React, { useState, useCallback, useMemo, useEffect } from "react";

import {Link } from "react-router-dom";

import {
    Row, 
    Col,
    Input,
    Form,
    Button,
    Result,
    message
} from "antd";

import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";

export const ChangePassword = (props) => {
    // 状态
    const [data, setData] = useState({});
    const [showResult, setShowResult] = useState(false);

    const formRef = useMemo(() => React.createRef(), []);

    // 获取用户信息
    const fetchUserInfo = useCallback(() => {
        let url = "/api/v1/account/login";
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              console.log(responseData);
              if(responseData.logined){
                  setData(responseData);
                  formRef.current.setFieldsValue({username: responseData.username})
              }else{
                  message.info("当前未登录用户");
                  props.history.push("/user/login?next=/user/change/password");
              }
          })
            .catch(err => {
                console.log(err);
            })
    }, [formRef, props.history])

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo])

    const handleSubmit = useCallback(values => {
        // console.log(values);
        // PUT修改账号密码
        const url = "/api/v1/account/user/password/change";
        fetchApi.Put(url, {},
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
                if(data.status){
                    // message.success("创建账号成功, 请登录", 5);
                    setShowResult(true);
                }else{
                    if(data.message){
                        message.warn(data.message);
                    }else{
                        message.warn(JSON.stringify(data), 5);
                    }
                }
          })
            .catch(err => {
                console.log(err);
                if(err.status === 400){
                    if(err.data && err.data.message){
                        message.warn(err.data.message);
                    }else{
                        message.error(JSON.stringify(err.data), 5);
                    }
                }
            })
    }, []);

    useEffect(() => {
        // 填充表格
        formRef.current.setFieldsValue({});
    }, [formRef])

    if(showResult){
        return (
            <div classname="container">
                <Result
                    status="success"
                    title="密码修改成功!"
                    subTitle={`您好！${data.username}, 请重新登录！`}
                    extra={[
                        <Link to="/user/signup" key="index">
                            <Button key="index">
                                注册
                            </Button>
                        </Link>,
                        <Link to="/user/login" key="login">
                            <Button type="primary" key="login">
                                登录
                            </Button>
                        </Link>
                    ]}
                />
            </div>
        )
    }

    return (
        <div className="container">
            <Row className="signup">
                <Col xs={{ span: 20, offset: 2 }} lg={{ span: 6, offset: 9 }}>
                    <div className="logo">
                        <img
                          src="http://127.0.0.1:9000/static/image/logo-kanban.svg"
                          alt="Logo"
                        />
                    </div>

                    <Form ref={formRef}
                        onFinish={handleSubmit} name="baseForm"
                        className="login-form">

                        <Form.Item
                            name="username"
                            rules={[
                                {required: true, message: "请输入用户名"},
                            ]}
                        >
                            <Input
                              prefix={<Icon type="user" />}
                              placeholder="username"
                              disabled={true}
                              allowClear
                            />
                        </Form.Item>

                        <Form.Item
                          name="old_password"
                          rules={[{ required: true, message: "请输入旧的密码" }]}
                        >
                            <Input
                              prefix={<Icon type="lock" />}
                              size="large"
                              type="password"
                              placeholder="旧的密码"
                              allowClear
                            />
                        </Form.Item>

                        <Form.Item
                          name="password"
                          rules={[{ required: true, message: "请输入密码" }]}
                        >
                            <Input
                              prefix={<Icon type="lock" />}
                              size="large"
                              type="password"
                              placeholder="登录密码"
                              allowClear
                            />
                        </Form.Item>

                        <Form.Item
                          name="re_password"
                          rules={[{ required: true, message: "请输入密码" }]}
                        >
                            <Input
                              prefix={<Icon type="lock" />}
                              size="large"
                              type="password"
                              placeholder="重复密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                style={{ width: "100%" }}
                            >
                                修改密码
                            </Button>
                        </Form.Item>

                        <Form.Item>
                        <Row>
                            <Col span={12} className="login-form-change">
                                <Link to="/">
                                    首页
                                </Link>
                            </Col>
                            <Col span={12} className="login-form-forget">
                                <Link to="/user/login">
                                    登录
                                </Link>
                            </Col>
                        </Row>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}
export default ChangePassword;
