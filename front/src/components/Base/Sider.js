/**
 * 左右布局左侧的内容
 */
import React, {useState, useEffect, useCallback, useMemo, useContext} from "react"
import { Link } from "react-router-dom";
import {Layout, Menu, Dropdown, message} from "antd";
import { Resizable } from 'react-resizable';

import { GlobalContext } from "./Context";
import Icon from "./Icon";
import ArticlesNav from "./ArticlesNav";
import fetchApi from "../Utils/fetchApi";

function LeftSider({showLeftSider, setShowLeftSider}){
    // 用户所有的分类列表
    const [categories, setCategories] = useState([]);
    // 选中的当前分类
    const [currentCategory, setCurrentCategory] = useState({});
    // 刷新导航相关的操作
    const { setRefreshNavTimes, history } = useContext(GlobalContext);

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

    // namespace的选项
    let categoriesElements = useMemo(() => {
        let menuItems = categories.map((item, index) => {
            return (
                <Menu.Item key={index} onClick={e => {
                    // console.log(e);
                    // 修改浏览器当前标签的标题
                    document.title = `看板-分类-${item.name}`;
                    setCurrentCategory(item);
                }}>
                    {item.name}
                </Menu.Item>
            );
        });

        return (
            <Menu className="categories-list">
                {menuItems}
            </Menu>
        );
    }, [categories]);

    const toogleLeftSider = useCallback((e) => {
        e.preventDefault();
        setShowLeftSider(prevState => {
            localStorage.setItem("showLeftSider", !prevState);
            return !prevState;
        });
    }, [setShowLeftSider]);

    const articlesNavElement = useMemo(() => {
        if(showLeftSider){
            return (
             <ArticlesNav 
               category={currentCategory.id}
            />
            )
        }else{
            return null;
        }
    }, [currentCategory.id, showLeftSider]);

    const handlerAddNewArticle = useCallback(e => {
        console.log(e);
        // 阻止冒泡
        e.stopPropagation();
        // 添加个新的文章
        if(currentCategory.id < 0){
            message.warn("还未选择分类，不可创建文章", 3);
            return;
        }

        // 发起创建文章请求
        let url = "/api/v1/docs/article/create";
        fetchApi.Post(url, {}, {
            data: {category: currentCategory.id}
        })
          .then(responseData => {
              if(responseData.id > 0){
                  message.success("添加文章成功");
                  // 刷新导航
                  setRefreshNavTimes(prevState => prevState + 1);
                  //  跳转创建的文章页
                  history.push(`/docs/article/${responseData.id}`);

              }else{
                  message.warn(JSON.stringify(responseData));
              }
          })
            .catch(err => {
                console.log(err);
            })
        
    }, [currentCategory.id, history, setRefreshNavTimes])

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
                            
                        {/* 分类 */}
                        <div className="clear"></div>
                        <div className="namespace">
                            <Dropdown overlay={categoriesElements} trigger={["click"]}>
                                <div>
                                    <span style={{color: "red"}}>
                                        <Icon type="flag"  />
                                    </span>
                                    <div className="current">
                                        {currentCategory.name}
                                    </div>
                                    <Icon type="arrows-v" />
                                </div>
                            </Dropdown>
                        </div>
                    </div> 

                    <div className="content">
                        {/* 文章导航 */}
                        {
                            showLeftSider && articlesNavElement
                        }
                        {/* 文章导航内容结束 */}
                    </div> 

                    <div className="footer" onClick={handlerAddNewArticle}>
                        <Icon type="plus"/> 
                        新的文章
                    </div>   
                </div>
            </Layout.Sider>
        </Resizable>

    );
}
export default LeftSider;