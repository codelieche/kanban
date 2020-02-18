/**
 * 左右布局左侧的内容
 */
import React, {useState, useEffect, useCallback, useMemo} from "react"
import {Layout} from "antd";
import { Resizable } from 'react-resizable';

import Icon from "./Icon";
import ArticlesNav from "./ArticlesNav";

function LeftSider({showLeftSider, setShowLeftSider}){

    const [category, setCategory] = useState(1);

    let widthInit = useMemo(() => {
        // 从localStorage中获取宽度
        let widthValue = localStorage.getItem("leftSiderWidth");
        if(Number.isNaN(widthValue)){
            return 200;
        }else{
            return parseInt(widthValue, 10);
        }

    }, []);


    const [width, setWidth] = useState(widthInit);

    useEffect(() => {

        // 组件要卸载的时候，储存一下宽度
        return () => {localStorage.setItem("leftSiderWidth", width);}
    })

    const onResize = useCallback((event, { element, size }) => {
        // console.log(size.width);
        // 左边栏最小156px；最大460px；
        if(size.width < 156){
            setWidth(156);
            return;
        }
        
        if(size.width <= 460){
            setWidth(size.width);
            // localStorage.setItem("leftSiderWidth", size.width);
        }else{
            setWidth(460);
        }
      }, [setWidth]);

    const toogleLeftSider = useCallback((e) => {
        e.preventDefault();
        setShowLeftSider(prevState => {
            localStorage.setItem("showLeftSider", !prevState);
            return !prevState;
        });
    }, [setShowLeftSider]);

    const articlesNavElement = useMemo(() => {
        if(showLeftSider){
            return <ArticlesNav category={category}/>
        }else{
            return null;
        }
    }, [category, showLeftSider])

    return (
        <Resizable className="box"  
          axis='x' height={0} 
          width={width} onResize={onResize}
        >
            <Layout.Sider style={{height: "100vh"}} width={width}>
                <div className="left-sider">
                    <div className="header">
                        <div className="namespace">
                            <div className="logo">
                                <img alt="logo"
                                src="https://www.codelieche.com/static/images/logo-kanban.svg">
                                </img>
                            </div>
                            <div className="toogle" onClick={toogleLeftSider}>
                                <Icon type="angle-double-left" noMarginRight={true}></Icon>
                            </div>
                        </div>
                    </div> 

                    <div className="content">
                        {/* 文章导航 */}
                        {
                            showLeftSider && articlesNavElement
                        }
                    </div> 

                    <div className="footer">
                        底部内容
                    </div>   
                </div>
            </Layout.Sider>
        </Resizable>

    );
}
export default LeftSider;