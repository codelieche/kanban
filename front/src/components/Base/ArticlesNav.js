/**
 * 文章导航
 */

import React, {useState, useMemo, useEffect, useCallback, useContext} from "react";
import {
    NavLink
} from 'react-router-dom';
import {
    message
} from "antd";

import { GlobalContext } from "../Base/Context";
import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";

export const NavItem = ({item, index, activeNavIDs}) => {
    // 状态
    const [active, setActive] = useState(false);
    // isActive是控制其子nav是否展开的
    const [isActive, setIsActive] = useState(false);

    // 子文章列表
    let childrenElements = item.children.map((item, index) => {
        return <NavItem item={item} index={index} key={index} activeNavIDs={activeNavIDs} />
    });

    // 点击的active开关
    const handleItemActiveToogle = useCallback(e => {
        // console.log(e);
        setActive(prevState => {
            return !prevState
        })
    }, []);

    useEffect(() => {
        let currentIsActive = activeNavIDs.indexOf(item.id) >= 0;
        // console.log(item.id, activeNavIDs, currentIsActive);
        if(currentIsActive !== isActive){
            setIsActive(currentIsActive);
        }
    }, [activeNavIDs, isActive, item.id])


    return (
        <div key={index} className="nav">
            {/* 不同级别，不同的padding */}
            <div className="item" >
                <NavLink to={`/docs/article/${item.id}`} 
                    activeClassName="active"
                    // className={isActive ? "isActive" : ""}
                >
                    <div className="title" 
                    style={{paddingLeft: 12 * item.level}}
                    onClick={handleItemActiveToogle}
                    >
                            {childrenElements.length > 0 && <Icon type={(active || isActive) ? "caret-down" : "caret-right"} />}
                            {item.title ? item.title : <span className="no-title">无标题</span>}
                    </div>
                </NavLink>

                {/* 显示children */}
                {
                    childrenElements.length > 0 && (
                        <div className={(active || isActive) ? "children active" : "children"}>
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
    const { navData } = useContext(GlobalContext);

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

    const activeNavIDs = useMemo(() => {
        let idsList = [];

        navData.forEach(item => {
            if(item.id && item.id > 0){
                idsList.push(item.id);
            }
        })
        return idsList;
    }, [navData]);

    // 当category变更的时候需要获取一下文章列表
    useEffect(() => {
        if(category !== currentCategory){
            // 获取新的文章列表
            fetchData(category);
        }
    }, [currentCategory, category, fetchData]);

    // 渲染导航
    let navElements = [];
    navElements = dataSource.map((item, index) => {
        return <NavItem item={item} index={index} key={index} activeNavIDs={activeNavIDs} />;
    });

    return(
        <div className="articles">
            {navElements}
        </div>
    );
}

export default ArticlesNav;