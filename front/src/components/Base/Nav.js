/**
 * 这个是站点左侧导航
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
import React from 'react';
import {
    // Icon,
    Tooltip
} from 'antd';
// import Icon from "./Icon";
import fetchApi from "../Utils/fetchApi";
import {
    NavLink
} from 'react-router-dom';


import navData from './NavData';

// 左侧的导航组件
class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navData: [],
            openTopMenuKey: this.props.defaultOpenKey,
            collapsed: this.props.collapsed,
            defaultOpenKey: this.props.defaultOpenKey,
        };
        this.topMenuOnClick = this.topMenuOnClick.bind(this);
    }

    componentDidMount() {
        this.fetchNavData();
        // this.setState({
            // navData: navData
        // });
    }

    fetchNavData = () => {
        // 获取用用户导航数据
        const url = "/api/v1/account/user/nav/list";
        fetchApi.Get(url)
        .then(data => {
            if(data instanceof Array) {
                this.setState({navData: data});
            }else{
                // 填写默认的导航菜单
                this.setState({navData: navData});
            }
        })
        .catch(err => {
            // 填写默认的导航菜单
            this.setState({navData: navData});
            console.log(err);
        });
    }

    topMenuOnClick(key) {
        // 设置当前展开的一级菜单key
        if(this.state.openTopMenuKey === key){
            this.setState({
                openTopMenuKey: null,
            });
        }else{
            this.setState({
                openTopMenuKey: key,
            });
        }
    }

    // static getDerivedStateFromProps(nextProps, prevState){
    //     // console.log(nextProps);   
    //     // console.log(prevState);   
    //     if(nextProps.defaultOpenKey !== prevState.defaultOpenKey && nextProps.defaultOpenKey){
    //         return {
    //             openTopMenuKey: nextProps.defaultOpenKey,
    //         }
    //     }else{
    //         return null;
    //     }
    //  }

    render() {
        // 先申明导航菜单元素，最外层的导航菜单class
        var topMenuElements, navLeftClass;
        if(this.props.collapsed){
            // 当侧边栏收起的时候
            navLeftClass = "menu-left menu-small";
            // 根据navData渲染导航菜单元素
            topMenuElements = this.state.navData.map((item, index) => {
                // 生成二级菜单元素
                var subMenuItems = item.children.map((v, i) => {
                    return (
                        <Tooltip title={v.title} placement='right' key={i}>
                            <li className="sub-menu-item">
                                <NavLink to={v.slug} activeClassName="active">
                                    {/* <Icon type={v.icon}></Icon> */}
                                    <i className={`fa fa-${v.icon}`}></i>
                                </NavLink>
                            </li>
                        </Tooltip>
                    );
                });
                // 生成一级菜单元素
                var topMenuClass = "top-menu";
                if(this.state.openTopMenuKey === item.key){
                    topMenuClass = "top-menu active";
                }
                // 返回一级菜单元素（内嵌二级菜单元素列表）
                return (
                    <div className={topMenuClass} key={index}>
                        <Tooltip title={item.title} placement="right" overlayStyle={{opacity: 1}}>
                            <div className="top-menu-title" onClick={() => {this.topMenuOnClick(item.key)}}>
                                {/* <Icon type={item.icon} /> */}
                                <i className={`fa fa-${item.icon}`}></i>
                            </div>
                        </Tooltip>
                        {/* 二级菜单列表 */}
                        <ul className="sub-menu-list">
                            {subMenuItems}
                        </ul>
                    </div>
                );
            });
        }else{
            // 当侧边栏展开的时候，不用Tooltip，而使用title了
            navLeftClass = "menu-left";
            topMenuElements = this.state.navData.map((item, index) => {
                // 生成二级菜单menu元素
                var subMenuItems = item.children.map((v, i) => {
                    // 判断是否是站外链接
                    // console.log(v, i);
                    if(v.is_link === true){
                        // 是站外链接就用a标签
                        return (
                            <li className="sub-menu-item" key={i}>
                                <a href={v.link} target={v.target} rel="noopener noreferrer">
                                    <i className={`fa fa-${v.icon}`}></i>
                                    <span className="title">{v.title}</span>
                                </a>
                                {/* <Link to={v.link} target={v.target}>
                                    <i className={`fa fa-${v.icon}`}></i>
                                    <span className="title">{v.title}</span>
                                </Link> */}
                            </li>
                        );
                    }else{
                        // 不是站外链接就用NavLink，当点击的时候会添加activeClassName的class
                        return (
                            <li className="sub-menu-item" key={i}>
                                <NavLink to={v.slug} activeClassName="active" 
                                  target={v.target === "_blank" ? "_blank" : ""}>
                                    <div className="sub-menu-title">
                                        {/* <Icon type={v.icon} /> */}
                                        <i className={`fa fa-${v.icon}`}></i>
                                        <span className="title">{v.title}</span>
                                    </div>
                                </NavLink>
                            </li>
                        );
                    }
                });
                // 生成top-menu元素
                var topMenuClass = "top-menu";
                if(this.state.openTopMenuKey === item.key){
                    // 当展开的key与当前菜单的key相同的时候， 加上active的class
                    topMenuClass = "top-menu active";
                }
                // 返回一级菜单元素（内嵌二级菜单元素列表）
                return (
                    <div className={topMenuClass} key={index} scoll="no">
                        <div className="top-menu-title" onClick={() => {this.topMenuOnClick(item.key)}}>
                            {/* <Icon type={item.icon} /> */}
                            <i className={`fa fa-${item.icon}`}></i>
                            <span className="title">{item.title}</span>
                        </div>
                        {/* 二级菜单元素 */}
                        <ul className="sub-menu-list">
                            {subMenuItems}
                        </ul>
                    </div>
                );
            })
        }

        return (
            <div className={navLeftClass}>
                {topMenuElements}
            </div>
        );
    }
}

export default Nav;
