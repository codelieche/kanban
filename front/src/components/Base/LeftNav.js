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
import React, {useState, useEffect, useCallback} from "react";
import { NavLink} from "react-router-dom";

import fetchApi from "../Utils/fetchApi";
import Icon from "./Icon";

// 渲染导航
export const NavItem = ({item, index}) => {
    // 状态
    // const [active, setActive ] = useState(false);
    const [openChildren, setOpenChildren ] = useState(false);

    // 子导航列表
    let childrenElements = item.children.map((item, index) => {
        return <NavItem item={item} index={index} key={index} />
    });

    // 点击的active开关
    const handleItemActiveToggle = useCallback(e => {
        setOpenChildren(prevState => !prevState);
    }, []);

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

    // 标题
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
    const [ navData, setNavData ] = useState([]);
    const [ collapsed, setCollapsed] = useState(false);

    // 获取用用户导航数据
    const fetchNavData = () => {
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
    }

    useEffect(() => {
        if(navData.length === 0){
            // 获取导航数据
            fetchNavData();
        }
        // 是否折叠
        if(props.collapsed !== collapsed){
            setCollapsed(props.collapsed);
        }
    }, [collapsed, navData.length, props.collapsed])

    // 导航菜单
    let navElements = navData.map((item, index) => {
        return <NavItem item={item} index={index} key={index} collapsed={collapsed} />
    })

    return (
        <div className="nav-list">
            {/* 导航列表 */}
            {navElements}
        </div>
    )
}

export default LeftSiderNav;