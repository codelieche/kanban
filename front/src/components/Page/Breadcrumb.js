/**
 * 面包屑导航相关的组件
 */

import React from "react";
import {Link} from "react-router-dom";
import { Breadcrumb } from "antd";

import Icon from "../Base/Icon";

 /**
  * 头部面包屑：
  * 传递的属性：props
  * @param {Array} data 
  * data格式：[
  * {
  *    title: "标题",
  *    icon: "图标",
  *    link: "是否需要跳转"
  * }
  * ]
  */
 export function NavBreadcrumb({data}) {

    if(data && data instanceof Array){
        const items = data.map((item, index) => {
            let iconElement;
            if(item.icon){
                iconElement = (
                    <Icon type={item.icon} noMarginRight={true}/>
                );
            } 
            //  是否有链接
            if(item.link){
                return (
                    <Breadcrumb.Item key={index}>
                        <Link to={item.link}>
                            {iconElement}{item.title}
                        </Link>
                    </Breadcrumb.Item>
                );
            }else{
                return (
                    <Breadcrumb.Item key={index}>
                        {iconElement}{item.title}
                    </Breadcrumb.Item>
                );
            }
        });

        // 返回面包屑导航
        return (
            <Breadcrumb className="nav">
                {items}
            </Breadcrumb>
        );
    
    }else{
        // 不是数组就返回null
        return null
    }

 }

 export default NavBreadcrumb;