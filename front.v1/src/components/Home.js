/**
 * 主页：布局方式一
 * 左侧为功能菜单，右侧是非文章内容
 */
import React, { useState, useEffect } from "react";

import {
    Layout
} from "antd";

import LeftSider from "./Base/LeftSider";
import {GlobalContext} from "./Base/Context";
import RightContent from "./Base/Right2";

function Home(props){
    // 是否显示左右布局
    const [showLeftSider, setShowLeftSider] = useState(false);
    // 控制刷新导航菜单的操作: 如果需要刷新左侧导航，
    // 设置: setRefreshNavTimes(prevState => prevState + 1);
    const [refreshNavTimes, setRefreshNavTimes] = useState(0);
    // 导航信息
    const [navData, setNavData] = useState([
        {
            title: "首页",
            icon: "home",
            link: "/"
        }
    ]);

    useEffect(() => {
        // 从localStorate中获取数据
        let value = localStorage.getItem("showLeftSider");
        // console.log(value, typeof value, Boolean(value));
        // localStorage.getItem获取到的是字符串
        if(value === null){
             // 如果不存在，那么也设为显示侧边栏
            setShowLeftSider(true);
            return;
        }else if(value !== showLeftSider.toString()){
            setShowLeftSider(value === "true" ? true : false);
        }

        // 判断是不是首页:后续继续调整
        if(props.location.pathname === "/"){
            // 修改浏览器当前标签的标题
            document.title = `看板-首页`;
            if(navData.length > 1){
                setNavData([
                    {
                        title: "首页",
                        icon: "home",
                        link: "/"
                    }
                ]);
            }
        }else{
            // console.log(props.location.pathname);
        }
    }, [navData.length, props.location.pathname, showLeftSider]);

    let leftSiderElement;
    if(showLeftSider){
        leftSiderElement = (
            <LeftSider 
                showLeftSider={showLeftSider} 
                setShowLeftSider={setShowLeftSider}
                refreshNavTimes={refreshNavTimes}
                defaultOpenKey={props.defaultOpenKey}
            />
        );
    }

    return (
        <GlobalContext.Provider value={
            {
                navData,
                setNavData,
                history: props.history,
                // 操作更新左侧导航要用到
                refreshNavTimes,
                setRefreshNavTimes
            }
        }>
            <Layout className="left-right-layout">
                {leftSiderElement}
                <Layout>
                    <Layout.Content>
                        <RightContent 
                          {...props}
                          showLeftSider={showLeftSider}
                          setShowLeftSider={setShowLeftSider}
                        />
                    </Layout.Content>
                    {/* <Layout.Footer>
                        底部内容
                    </Layout.Footer> */}
                </Layout>
            </Layout>
        </GlobalContext.Provider>
    );
}

export default Home;