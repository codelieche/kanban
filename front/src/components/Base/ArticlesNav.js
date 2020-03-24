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

export const NavItem = ({item, index, activeNavIDs, canWrite}) => {
    // 状态
    const [active, setActive] = useState(false);
    // isActive是控制其子nav是否展开的
    const [isActive, setIsActive] = useState(false);
    const { history, setRefreshNavTimes } = useContext(GlobalContext);

    // 子文章列表
    let childrenElements = item.children.map((item, index) => {
        return <NavItem item={item} index={index} key={index} activeNavIDs={activeNavIDs} canWrite={canWrite} />
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

    // 添加事件
    const handleAddClick = useCallback((e) => {
        // console.log(item, e);
        // 阻止冒泡
        e.stopPropagation();
        e.preventDefault();
        // 添加文章
        let url = "/api/v1/docs/article/create";
        let data = {
            parent: item.id,  // 添加子文章，记得添加parent
            group: item.group,
        }
        fetchApi.Post(url, {}, {
            data: data,
        })
          .then(responseData => {
              if(responseData.id > 0){
                //   创建文章成功
                // 刷新左侧导航
                setRefreshNavTimes(prevState => prevState + 1);
                
                // 跳转新的文章页面
                let articleUrl = `/docs/article/${responseData.id}`;

                history.push(articleUrl);

              }else{
                  console.log("创建文章失败");
              }
          })
            .catch(err => {
                console.log(err);
            })
    }, [history, item, setRefreshNavTimes]);


    return (
        <div key={index} className="nav">
            {/* 不同级别，不同的padding */}
            <div className="item" >
                <NavLink to={`/docs/article/${item.id}`} 
                    activeClassName="active"
                    // className={isActive || active ? "active" : ""}
                >
                    <div className="title" 
                    style={{paddingLeft: 12 * item.level}}
                    onClick={handleItemActiveToogle}
                    >
                            {childrenElements.length > 0 && <Icon type={(active || isActive) ? "caret-down" : "caret-right"} />}
                            {item.title ? item.title : <span className="no-title">无标题</span>}

                        {/* 有写入权限的时候才显示add */}
                        {canWrite && (
                            <div className="add" onClick={handleAddClick}>
                                <Icon type="plus-square-o" />
                            </div>
                        )}
                        
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
export const ArticlesNav= ({group}) => {
    const [currentGroupID, setCurrentGroupID] = useState(null);
    const { 
        navData, refreshNavTimes, 
        currentArticleGroupID, // 当前的分类ID
        groupPermissions, setGroupPermissions  // 文章分类的权限
    } = useContext(GlobalContext);

    const [dataSource, setDataSource] = useState([]);
    // 刷新方式获取导航数据次数
    const [fetchTimes, setFetchTimes] = useState(0);

    // 是否有写入分类文章的权限
    const [canWrite, setCanWrite] = useState(false);

    const fetchData = useCallback((group, isReFresh) => {
        // 修改一下当前的分类
        setCurrentGroupID(group);
        // 修改fetch次数
        if(isReFresh){
            setFetchTimes(prevState => {
                return prevState++;
            });
        }

        if(! group){
            // category不可为空
            return 
        }
        let url = `/api/v1/docs/article/all?group=${group}`;
        // 获取当前分类的所有文章
        fetchApi.Get(url, {}, {})
          .then(data => {
              if(Array.isArray(data)){
                setDataSource(data);
                // 跳转到第一篇文章的详情页
                
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
        // console.log(fetchTimes, refreshNavTimes);
        if(group !== currentGroupID){
            // 获取新的文章列表
            fetchData(group);
        }else if(fetchTimes <= refreshNavTimes){
            // 获取新的文章列表
            fetchData(group, true);
        }
    }, [currentGroupID, group, fetchData, fetchTimes, refreshNavTimes]);

    // 获取当前用户对分组的操作权限：read,write,delete等
    const fetchGroupPermissions = useCallback( categoryID => {
        let url = `/api/v1/docs/group/${categoryID}/permissions`;
        fetchApi.Get(url, {}, {})
          .then(responseData => {
            if(Array.isArray(responseData)){
                setGroupPermissions(responseData);
            }
          })
            .catch(err => {
                console.log(err);
            })
    }, [setGroupPermissions])

    // 监控当前分组是否变化
    useEffect(() => {
        if(currentArticleGroupID > 0){
            fetchGroupPermissions(currentArticleGroupID);
        }
    }, [currentArticleGroupID, fetchGroupPermissions])

    // 监控能否写入
    useEffect(() => {
        if(groupPermissions.indexOf("write") >= 0){
            setCanWrite(true);
        }else{
            setCanWrite(false);
        }
    }, [groupPermissions])

    // 渲染导航
    let navElements = [];
    navElements = dataSource.map((item, index) => {
        return <NavItem item={item} index={index} key={index} activeNavIDs={activeNavIDs} canWrite={canWrite} />;
    });

    return(
        <div className="articles">
            {navElements}
        </div>
    );
}

export default ArticlesNav;