/**
 * 左侧的导航
 * left-sider:
 * 上面是.header,下面是.footer
 * .content
 * 
 * navData是个列表，item元素格式：
 *   {
 *      icon: "图标",
 *      key: "一级菜单的key",
 *      title: "菜单的标题",
 *      slug: "地址,一级菜单不用，二级菜单需要",
 *      is_link: true/flase(是否是站外链接),
 *      link: "站外链接地址",
 *      target: "链接跳转的方式，默认是_self；_blank是在新的窗口打开页面",
 *      children: [item, "二级菜单的列表"], 
 *   }
 */
import React, {useState, useEffect, useCallback, useMemo} from "react";
import { NavLink} from "react-router-dom";
import { Popover } from "antd";

import fetchApi from "../Utils/fetchApi";
import Icon from "./Icon";

// 渲染导航
export const NavItem = ({item, index, collapsed, defaultOpenKey}) => {
    // 状态
    const [openChildren, setOpenChildren ] = useState(false);

    // 子导航列表
    let childrenElements = item.children.map((item, index) => {
        return <NavItem item={item} index={index} key={index} collapsed={collapsed} />
    });

    // 点击的active开关
    const handleItemActiveToggle = useCallback(e => {
        // e.stopPropagation();
        setOpenChildren(prevState => !prevState);
    }, []);

    // 判断是否需要显示当前的children
    useEffect(() => {
        if(!collapsed){
            if(defaultOpenKey === item.key){
                setOpenChildren(true);
            }else{
                // 是否关闭另外一个item的children，如果不想关闭可注释下面这行
                setOpenChildren(false);
            }
        }
    }, [collapsed, defaultOpenKey, item.key])

    // 导航标题的左侧图标
    let iconElement;
    if(item.icon){
        iconElement = <Icon type={item.icon} />
    }

    // 右侧的图标
    let rightIconElement;
    if(childrenElements.length > 0){
        rightIconElement = (
            <div className="right">
                <Icon type={openChildren ? "caret-down" : "caret-left"} />
            </div>
        );
    }

    // 判断导航是否收缩:
    if(collapsed){
        // 收缩的情况
        if(childrenElements.length > 0){
            return (
            <Popover 
              title={item.title}
              content={<div className="collapsed-nav-children">{childrenElements}</div>} 
              placement="rightTop">
                    <div className="item">
                        <div className="title">
                            <Icon type={item.icon ? item.icon : "angle-right"}></Icon>
                            {item.level <= 1 ? null : item.title}
                        </div>
                    </div>
                </Popover>
            );
        }else{
             // 判断是否是外链
            if(item.is_link && item.link){
                return (
                    <div className="item">
                        <a href={item.link} 
                            target={item.target === "_blank" ? "_blank" : ""}
                            rel="noopener noreferrer"
                        >
                            {/* 不同级别，不同的padding */}
                            <div 
                                className="title"
                            >
                                {/* {childrenElements.length > 0 && <Icon type={active ? "caret-down" : "caret-right"} />} */}
                                <Icon type={item.icon ? item.icon : "angle-right"}></Icon>
                                {item.title ? item.title : "无标题"} 
                            </div>
                        </a>
                    </div>
                )
            }else{
                return (
                    <div className="item">
                        <NavLink to={item.slug} 
                            activeClassName="active"
                            target={item.target === "_blank" ? "_blank" : ""}
                        >
                            {/* 不同级别，不同的padding */}
                            <div 
                                className="title"
                            >
                                <Icon type={item.icon ? item.icon : "angle-right"}></Icon>
                                {item.title ? item.title : "无标题"} 
                            </div>
                        </NavLink>
                    </div>
                )
            }
            
        }
        // 导航收缩情况end
    }else{
        // 未收缩情况
    }

    // 未收缩的情况
    let titleElement;
    if(childrenElements.length > 0){
        titleElement = (
            <div>
                {/* 不同级别，不同的padding */}
                <div 
                    className="title"
                    style={{paddingLeft: 12 * item.level}}
                    onClick={handleItemActiveToggle}
                >
                    {/* {childrenElements.length > 0 && <Icon type={active ? "caret-down" : "caret-right"} />} */}
                    {iconElement}
                    {item.title ? item.title : "无标题"} 
                    {rightIconElement}
                </div>
            </div>
        )
    }else{
        // 判断是否是外链
        if(item.is_link && item.link){
            titleElement = (
                <a href={item.link} target={item.target} rel="noopener noreferrer">
                    <div className="title" style={{paddingLeft: 12 * item.level}}>
                        {iconElement}
                        {item.title ? item.title : "无标题"} 
                        {rightIconElement}
                    </div>
                </a>
            );
        }else{
            titleElement = (
                <NavLink to={item.slug} 
                    activeClassName="active"
                    target={item.target === "_blank" ? "_blank" : ""}
                >
                    {/* 不同级别，不同的padding */}
                    <div 
                        className="title"
                        style={{paddingLeft: 12 * item.level}}
                        onClick={handleItemActiveToggle}
                    >
                        {/* {childrenElements.length > 0 && <Icon type={active ? "caret-down" : "caret-right"} />} */}
                        {iconElement}
                        {item.title ? item.title : "无标题"} 
                        {rightIconElement}
                    </div>
                </NavLink>
            );
        }
    }

    return (
            <div className="item" key={index}>
                {/* 标题 */}
                {titleElement}
                {collapsed ? "折叠" : ""}

                {/* 显示children */}
                {
                    childrenElements.length > 0 && (
                        <div className={ openChildren ? "children active" : "children"}>
                            {childrenElements}
                        </div>
                    )
                }
            </div>
    )
}

export const LeftSiderNav = (props) => {
    // 导航数据
    const [ navData, setNavData ] = useState(null);
    const [ collapsed, setCollapsed] = useState(false);

    // 获取用用户导航数据
    const fetchNavData = useCallback(() => {
        const url = "/api/v1/account/user/nav/list";
        fetchApi.Get(url)
        .then(data => {
            if(data instanceof Array) {
                setNavData(data);
            }else{
                // 填写默认的导航菜单
                console.log("获取导航数据出错");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }, [])

    // 获取导航数据
    useEffect(() => {
        fetchNavData();
    }, [fetchNavData])

    useEffect(() => {
        // 是否折叠
        if(props.collapsed !== collapsed){
            setCollapsed(props.collapsed);
        }
    }, [collapsed, props.collapsed])

    // 导航菜单
    let navElements = useMemo(() => {
        if(navData && navData.length > 0){
            return navData.map((item, index) => {
                return <NavItem item={item} index={index} key={index} collapsed={collapsed} defaultOpenKey={props.defaultOpenKey} />
            })
        }else{
            return null;
        }
    }, [collapsed, navData, props.defaultOpenKey])

    return (
        <div className="nav-list">
            {/* 导航列表 */}
            {navElements}
        </div>
    )
}

export default LeftSiderNav;