/**
 * 左右布局右侧的内容
 */
import React, {useState, useCallback} from "react";
import { Switch, Route } from "react-router-dom";

import RightContext from "./Context";
import Icon from "./Icon";
import Breadcrumb from "../Page/Breadcrumb";
import ArticlePage from "../Docs/Article/Detail";

function RightContent(props){
    // 导航信息
    const [navData, setNavData] = useState([
        {
            title: "首页",
            icon: "home",
            link: "/"
        }
    ]);

    const [letfSiderToggleIcon, setLeftSiderToggleIcon] = useState("align-justify")
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
        <RightContext.Provider value={{
            navData,
            setNavData,
        }}>

        <div className="right-content">
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
            </div>

            <div className="content">
                {/*  */}
                <Switch>
                    <Route
                      path="/docs/article/:id"
                      component={ArticlePage}
                    //   setNavData={setNavData}
                    //   location={props.location}
                      {...props}
                    >
                        
                    </Route>
                </Switch>
                <section>
                    
                </section>
            </div>
            
        </div>
        </RightContext.Provider>

    );
}
export default RightContent;