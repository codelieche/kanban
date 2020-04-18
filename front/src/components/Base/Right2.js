/**
 * 左右布局右侧的内容：
 * 【非】文章页的右侧
 */
import React, {useState, useCallback, useContext} from "react";
import { Switch, Route } from "react-router-dom";

import { GlobalContext } from "./Context";
import Icon from "./Icon";
import Breadcrumb from "../Page/Breadcrumb";
import { UserLoginOrInfo } from "./User";

import Footer from "./Footer";
// import ArticlePage from "../Docs/Article/Detail";
import DocsIndex from "../Docs/Index";
import TagsIndex from "../Tags/index";
import { ToolsIndexPage } from "../Tools/index";
import UserIndex from "../User/Index";
import TestIndex from "../Test/Index";

function RightContent(props){
    
    const [letfSiderToggleIcon, setLeftSiderToggleIcon] = useState("align-justify");
    const { navData } = useContext(GlobalContext);
    const toogleShowLeftSider = useCallback((e) => {
        e.preventDefault();
        props.setShowLeftSider(prevState => {
            localStorage.setItem("showLeftSider", !prevState);
            return !prevState;
        })
    }, [props]);

    const onMouseEnter = (e) => {
        // console.log(e);
        setLeftSiderToggleIcon("angle-double-right");
    }

    const onMouseLeave = (e) => {
        setLeftSiderToggleIcon("align-justify");
    }

    return (
        <div className="right-content">
            {/* 右侧的头部：导航和用户头像信息 */}
            <div className="header">
                <div className="toogle" onClick={toogleShowLeftSider} 
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  style={{display: props.showLeftSider ? "none" : "inline-block" }}>
                    <Icon type={letfSiderToggleIcon}></Icon>
                </div>
                {/* 面包屑开始 */}
                    <Breadcrumb data={navData} />
                {/* 面包屑结束 */}

                {/* 用户信息 */}
                <div className="user">
                    <UserLoginOrInfo />
                </div>
            </div>

            {/* 右侧的主体内容区域 */}
            <div className="container">
                {/*  */}
                <Switch>
                    {/* 文章页 */}
                    {/* <Route path="/docs/article/:id" 
                      component={ArticlePage} {...props} /> */}

                    {/* 文章分类页等 */}
                    <Route
                        path="/docs/"
                        component={DocsIndex}
                        location={props.location}
                    />
                    
                    {/* 标签相关 */}
                    <Route
                        path="/tags/"
                        component={TagsIndex}
                        location={props.location}
                    />

                    {/* 工具相关 */}
                    <Route
                        path="/tools/"
                        component={ToolsIndexPage}
                        location={props.location}
                    />

                    {/* 用户中心页面 */}
                    <Route
                        path="/user"
                        component={UserIndex}
                        location={props.location}
                    />

                    {/* 测试页面 */}
                    <Route
                        path="/test"
                        component={TestIndex}
                        location={props.location}
                    />

                </Switch>
            </div>

            {/* 右侧底部 */}
            <Footer>

            </Footer>
            
        </div>
    );
}
export default RightContent;