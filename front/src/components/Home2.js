/**
 * 布局方式二的主页
 */
import React, { useState, useEffect } from "react";

import {
    Layout
} from "antd";

import LeftSider from "./Base/Sider";
import RightContent from "./Base/Right";

function Home(props){
    // 是否显示左右布局
    const [showLeftSider, setShowLeftSider] = useState(false);

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
    }, [showLeftSider]);

    let leftSiderElement;
    if(showLeftSider){
        leftSiderElement = (
            // <Layout.Sider style={{height: "100vh"}}>
                <LeftSider showLeftSider={showLeftSider} setShowLeftSider={setShowLeftSider} />
            // </Layout.Sider>
        );
    }

    return (
        <div>
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
                </Layout>
            </Layout>
        </div>
    );
}

export default Home;