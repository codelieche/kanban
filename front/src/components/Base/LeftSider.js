/**
 * 左右布局左侧的内容
 */
import React, {useState, useEffect, useCallback, useMemo, useContext} from "react"
import { Link } from "react-router-dom";
import {Layout, message} from "antd";
import { Resizable } from 'react-resizable';

import { GlobalContext } from "./Context";
import Icon from "./Icon";
import { LeftSiderNav } from "./LeftNav";
import fetchApi from "../Utils/fetchApi";

function LeftSider({showLeftSider, setShowLeftSider}){
    // 用户所有的分类列表
    const [categories, setCategories] = useState([]);
    // 选中的当前分类
    const [currentCategory, setCurrentCategory] = useState({});
    // 刷新导航相关的操作
    // const { setRefreshNavTimes, history } = useContext(GlobalContext);

    let widthInit = useMemo(() => {
        // 从localStorage中获取宽度
        let widthValue = localStorage.getItem("leftSiderWidth");
        if(Number.isNaN(widthValue)){
            return 200;
        }else{
            return parseInt(widthValue, 10);
        }

    }, []);
    // 左侧导航的宽度
    const [width, setWidth] = useState(widthInit);

    // 获取分类的列表
    const fetchCategoriesData = useCallback(() => {
        
        let url = "/api/v1/docs/category/all";
        fetchApi.Get(url)
          .then(responseData => {
              if(Array.isArray(responseData)){
                  setCategories(responseData);
                  if(responseData.length > 0){

                    //   设置列表的第一个为，当前的分类
                    setCurrentCategory(responseData[0]);
                  }
              }else{
                  message.warn("获取分类列表数据出错", 3);
              }
          })
            .catch(err => {
                console.log(err);
            })
    }, [setCategories])

    useEffect(() => {
        // 获取分类数据
        if(categories.length === 0 ){
            fetchCategoriesData();
        }

        // 组件要卸载的时候，储存一下宽度
        return () => {localStorage.setItem("leftSiderWidth", width);}
    }, [categories.length, fetchCategoriesData, width])

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

    const navElement = useMemo(() => {
        if(showLeftSider){
            return (
             <LeftSiderNav />
            );
        }else{
            return null;
        }
    }, [showLeftSider]);


    return (
        <Resizable className="box"  
          axis='x' height={0} 
          width={width} onResize={onResize}
        >
            <Layout.Sider style={{height: "100vh"}} width={width}>
                <div className="left-sider">
                    <div className="header">
                        <div className="logo">
                            <Link to="/">
                                <img alt="logo"
                                src="https://www.codelieche.com/static/images/logo-kanban.svg">
                                </img>
                            </Link>
                            
                            <div className="toogle" onClick={toogleLeftSider}>
                                <Icon type="angle-double-left" noMarginRight={true}></Icon>
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="clear"></div>
                       
                    </div> 

                    <div className="content">
                        {/* 导航 */}
                        {navElement}
                        {/* 导航内容结束 */}
                    </div> 

                    {/* <div className="footer" onClick={handlerAddNewArticle}>
                        <Icon type="plus"/> 
                        展开
                    </div>    */}
                </div>
            </Layout.Sider>
        </Resizable>

    );
}
export default LeftSider;