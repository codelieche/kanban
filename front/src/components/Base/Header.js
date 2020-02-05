/**
 * 站点头部Header
 */
import React from 'react';
import {
    Link
} from 'react-router-dom';
import {
    // Button,
    Avatar,
    Menu,
    Dropdown,
} from 'antd';

import fetchApi from "../Utils/fetchApi";
import Icon from "./Icon";

class UserLoginOrInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogined: false,
            username: "游客!",
            userInfo: {}
        }
    }

    componentDidMount(){
        // 检查登录
        this.checkLogin();
    }

    // 不同系统需要不同的checkLogin函数
    checkLogin = () => {
        const url = "/api/v1/account/login";
        fetchApi.Get(url)
          .then(data => {
            // console.log(data);
            if(data.logined){
                this.setState({
                    isLogined: true, 
                    username: data.username
                });
            }else{
                this.setState({
                    isLogined: false,
                    username: "",
                });
            }
          })
            .catch(err => console.log(err))
    }

    render(){
        // 如果用户是登录的，就显示用户名字
        // 如果是未登录的状态，就显示登录/注册按钮
        if (this.state.isLogined){
            // 下拉菜单
            const menu = (
                <Menu>
                    <Menu.Item>
                        <Link to="/user/center">
                            <Icon type="user-circle"> 用户中心</Icon>
                        </Link>
                    </Menu.Item>

                    <Menu.Item>
                        <Link to="/user/message">
                            <Icon type="envelope-o"> 消息中心</Icon>
                        </Link>
                    </Menu.Item>

                    <Menu.Item>
                        <Link to="/user/logout">
                            <Icon type="sign-out"> 退出登录</Icon>
                        </Link>
                    </Menu.Item>
                </Menu>
            );

            return (
                <Dropdown overlay={menu}>
                        <Avatar style={{backgroundColor: "#4A90E2"}}>{this.state.username}</Avatar>
                </Dropdown>
            );
        }else{
            return (
                    <Link to="/user/login">
                        {/* <Button type="default">登录</Button> */}
                        <Icon type="sign-in"></Icon>登录
                    </Link>
            );
        }
    }
}

export default class Header extends React.Component {
    render() {
        return (
            <div>
                <Link to="/" className="logo">
                    <img src="http://www.codelieche.com/static/images/logo-kanban.svg" alt="首页" />
                </Link>

                <ul className="nav">
                    <li>
                        <div className="link">关于我们</div>
                    </li>

                    {/* 显示登录/退出登录信息 */}
                    <li className="user">
                        <UserLoginOrInfo />
                    </li>
                </ul>
                
            </div>
        );
    }
}