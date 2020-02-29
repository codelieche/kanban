/**
 * 左右布局右侧的内容
 */
import React, {useState, useCallback, useContext} from "react";
import { Switch, Route } from "react-router-dom";

import { GlobalContext } from "./Context";
import Icon from "./Icon";
import Breadcrumb from "../Page/Breadcrumb";
import { UserLoginOrInfo } from "./User";

// 底部
import Footer from "./Footer";
import UserCenterIndex from "../User/Center/Index";
import ArticlePage from "../Docs/Article/Detail";

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
            {/* 右侧头部 */}
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

            {/* 右侧主体区域 */}
            <div className="container">
                {/*  */}
                <Switch>
                    <Route
                      path="/"
                      exact={true}
                      component={UserCenterIndex}
                      {...props}
                    />
                    <Route
                      path="/docs/article/:id"
                      component={ArticlePage}
                      {...props}
                    >
                        
                    </Route>
                </Switch>
            </div>

            {/* 右侧底部 */}
            <Footer>
            </Footer>
            
        </div>
    );
}
export default RightContent;