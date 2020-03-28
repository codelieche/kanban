/**
 * 注册用户页面
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

export const UserSignUp = (props) => {
    // 状态
    const [data, setData] = useState({});
    const [showResult, setShowResult] = useState(false);

    const formRef = useMemo(() => React.createRef(), []);

    const handleSubmit = useCallback(values => {
        console.log(values);

        // POST创建账号
        const url = "/api/v1/account/user/create";
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
                if(data.id > 0){
                    // message.success("创建账号成功, 请登录", 5);
                    setData(data);
                    setShowResult(true);
                }else{
                    message.warn(JSON.stringify(data), 5);
                }
          })
            .catch(err => {
                console.log(err);
                if(err.status === 400){
                    message.error(JSON.stringify(err.data), 5);
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
                    title="账号注册成功!"
                    subTitle={`您好！${data.username}, 请点击登录！`}
                    extra={[
                        <Link to="/">
                            <Button key="index">
                                首页
                            </Button>
                        </Link>,
                        <Link to="/user/login">
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
                          name="mobile"
                          rules={[{ required: true, message: "请输入密码" }]}
                        >
                            <Input
                              prefix={<Icon type="mobile" />}
                              size="large"
                              type="text"
                              placeholder="手机号"
                            />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            rules={[
                                {required: true, message: "请输入用户名"},
                            ]}
                        >
                            <Input
                              prefix={<Icon type="user" />}
                              placeholder="username"
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
                                注册
                            </Button>
                        </Form.Item>

                        <Form.Item>
                        <Row>
                            <Col span={12} className="login-form-change">
                                <Link to="">
                                    修改密码
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
export default UserSignUp;
