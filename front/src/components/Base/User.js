/**
 * 用户相关的组件
 */
import React, {useState, useEffect, useCallback} from "react";
import { 
    Menu, Dropdown, 
    // Avatar 
} from "antd";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import fetchApi from "../Utils/fetchApi";

export const UserLoginOrInfo = (props) => {

    const [ isLogined, setIsLogined ] = useState(false);
    const [ userInfo, setUserInfo] = useState({});
    const [checked, setChecked] = useState(false);

    // 不同系统需要不同的checkLogin函数
    const checkLogin = useCallback(() => {
        const url = "/api/v1/account/login";
        fetchApi.Get(url)
          .then(data => {
            // console.log(data);
            setChecked(true);

            if(data.logined){
                setIsLogined(true);
                setUserInfo({
                    username: data.username,
                });
            }else{
                setIsLogined(false);
                setUserInfo({
                    username: "未登录"
                });
            }
          })
            .catch(err => {
                console.log(err);
                setChecked(true);
            })
    }, [setIsLogined, setUserInfo])

    useEffect(() => {
        // 检查登录
        checkLogin();
    }, [checkLogin]);

    // 如果用户是登录的，就显示用户名字
    // 如果是未登录的状态，就显示登录/注册按钮
    if(!checked){
        return null;
    }else{
        // 检查之后才渲染
        if (isLogined){
            // 下拉菜单
            const menu = (
                <Menu>
                    <Menu.Item>
                        <Link to="/user/center">
                            <Icon type="user-circle"> 用户中心</Icon>
                        </Link>
                    </Menu.Item>

                    <Menu.Item>
                        <Link to="/docs/group">
                            <Icon type="folder"> 文档分组</Icon>
                        </Link>
                    </Menu.Item>

                    <Menu.Item>
                        <Link to="/docs/article/list">
                            <Icon type="file-text-o"> 文章列表</Icon>
                        </Link>
                    </Menu.Item>

                    <Menu.Item>
                        <Link to="/docs/image">
                            <Icon type="image"> 图片列表</Icon>
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
                    <div>
                        {/* <Avatar style={{backgroundColor: "#4A90E2"}}>{userInfo.username}</Avatar> */}
                        <Icon type="user-o"></Icon>
                        Hi ~ {userInfo.username}
                    </div>
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

export default UserLoginOrInfo;