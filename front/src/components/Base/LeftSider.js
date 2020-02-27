/**
 * 左右布局左侧的内容
 */
import React, {useState, useEffect, useCallback, useMemo} from "react"
import { Link } from "react-router-dom";
import {Layout, message} from "antd";
import { Resizable } from 'react-resizable';

// import { GlobalContext } from "./Context";
import Icon from "./Icon";
import { LeftSiderNav } from "./LeftNav";
import fetchApi from "../Utils/fetchApi";

function LeftSider({showLeftSider, setShowLeftSider}){
    // 用户所有的分类列表
    const [categories, setCategories] = useState([]);
    // 选中的当前分类
    // const [currentCategory, setCurrentCategory] = useState({});

    // 导航是否收缩
    const [ collapsed, setCollapsed] = useState(false);

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
                    // setCurrentCategory(responseData[0]);
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
             <LeftSiderNav collapsed={collapsed} />
            );
        }else{
            return null;
        }
    }, [showLeftSider, collapsed]);

    // 导航收缩开关
    const handleCollapsedToogle = useCallback(() => {
        setCollapsed(prevState => !prevState);
    }, [setCollapsed])

    // 保存收缩信息
    // useEffect(() => {
    //     // 从localStorate中获取数据
    //     let value = localStorage.getItem("leftSiderNavCollapsed");
    //     if(value === null){
    //         // 如果不存在，那么也设为显示侧边栏
    //         setCollapsed(false);
    //     }else{
    //         setCollapsed(value === "true" ? true : false);
    //     }

    //     return () => {
    //         // 写入localStorate中
    //         localStorage.setItem("leftSiderNavCollapsed", collapsed);
    //     }

    // }, [])

    return (
        <Resizable className="box"  
          axis='x' height={0} 
          width={width} onResize={onResize}
        >
            <Layout.Sider style={{height: "100vh"}} width={collapsed ? 64 : width}>
                <div className={ collapsed ? "left-sider collapsed" : "left-sider"}>
                    <div className="header">
                        <div className="logo">
                            <Link to="/">
                                <img alt="logo"
                                src="https://www.codelieche.com/static/images/logo-kanban.svg">
                                </img>
                            </Link>
                            {/* 是否显示左侧导航的按钮 */}
                            <div className="toogle" onClick={toogleLeftSider} style={{display: collapsed ? "none" : ""}}>
                                <Icon type="angle-double-left" noMarginRight={true}></Icon>
                            </div>
                            <div className="clear"></div>
                        </div>
                        {/* 是否收缩collapsed */}
                        {/* <div className="collapsed-toogle" onClick={handleCollapsedToogle}>
                            <Icon type={collapsed ? "indent" : "outdent"} />
                        </div> */}
                        <div className="clear"></div>
                       
                    </div> 

                    <div className="content">
                        {/* 导航 */}
                        {navElement}
                        {/* 导航内容结束 */}
                    </div> 

                    {/* 底部 */}
                    <div className="footer" onClick={handleCollapsedToogle}>
                        <div className="collapsed-toogle">
                            <Icon type={collapsed ? "indent" : "outdent"} />
                        </div>
                    </div>   
                </div>
            </Layout.Sider>
        </Resizable>

    );
}
export default LeftSider;