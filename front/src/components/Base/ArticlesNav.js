/**
 * 文章导航
 */

import React, {useState, useEffect, useCallback} from "react";
import {
    NavLink
} from 'react-router-dom';
import {
    message
} from "antd";

import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";

export const NavItem = ({item, index}) => {
    const [active, setActive] = useState(false);

    let childrenElements = item.children.map((item, index) => {
        return <NavItem item={item} index={index} key={index} />
    });

    const handleItemActiveToogle = useCallback(e => {
        // console.log(e);
        setActive(prevState => {
            return !prevState
        })
    }, []);

    return (
        <div key={index} className="nav">
            {/* 不同级别，不同的padding */}
            <div className="item" >
                <NavLink to={`/docs/article/${item.id}`} 
                    activeClassName="active"
                >
                    <div className="title" 
                    style={{paddingLeft: 12 * item.level}}
                    onClick={handleItemActiveToogle}
                    >
                            {childrenElements.length > 0 && <Icon type={active ? "caret-down" : "caret-right"} />}
                            {item.title ? item.title : <span className="no-title">无标题</span>}
                    </div>
                </NavLink>

                {/* 显示children */}
                {
                    childrenElements.length > 0 && (
                        <div className={active ? "children active" : "children"}>
                            {childrenElements}
                        </div>
                    )
                }
            </div>
        </div>
    );
}
/**
 * 获取某个分组的文章导航
 * @param {Number} param0 
 */
export const ArticlesNav= ({category}) => {
    const [currentCategory, setCurrentCategory] = useState("");
    const [dataSource, setDataSource] = useState([]);

    const fetchData = useCallback((category) => {
        // 修改一下当前的分类
        setCurrentCategory(category);
        if(! category){
            // category不可为空
            return 
        }
        let url = `/api/v1/docs/article/all?category=${category}`;
        // 获取当前分类的所有文章
        fetchApi.Get(url, {}, {})
          .then(data => {
              if(Array.isArray(data)){
                setDataSource(data);
              }else{
                  // 获取文章数据出错
                  message.warn("获取文章列表数据出错:" + JSON.stringify(data));
              }
          })
            .catch(err => {
                console.log(err);
            })
    }, []);

    // 当category变更的时候需要获取一下文章列表
    useEffect(() => {
        if(category !== currentCategory){
            // 获取新的文章列表
            fetchData(category);
        }
    }, [currentCategory, category, fetchData]);

    // 渲染导航
    // const renderNavItem = useCallback((item, index) => {
    //     let childrenElements = item.children.map((item, index) => {
    //         return renderNavItem(item, index);
    //     });

    //     return (
    //         <div key={index} className="nav">
    //             {/* 不同级别，不同的padding */}
    //             <div className="item">
    //                 <div className="title" style={{paddingLeft: 10 * item.level}}>
    //                     {item.title}
    //                 </div>

    //                 {
    //                     childrenElements.length > 0 && (
    //                         <div className="children">
    //                             {childrenElements}
    //                         </div>
    //                     )
    //                 }
    //             </div>
                
                
    //         </div>
    //     );
    // }, []);

    // 渲染导航
    let navElements = [];
    navElements = dataSource.map((item, index) => {
        return <NavItem item={item} index={index} key={index} />;
    });

    return(
        <div className="articles">
            {navElements}
        </div>
    );
}

export default ArticlesNav;