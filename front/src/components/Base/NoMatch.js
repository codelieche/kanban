/**
 * 当路由为匹配到Switch中的路由的时候
 * 使用NoMatch组件处理:
 * 当执行到这个组件的时候：
 * 1. 先保存:props.history.location.pathname到window.localStorage.reFreshPathname中
 * 2. 判断pathname和window.localStorage.reFreshPathname是否相等
 * 3. 如果不相等就刷新一下网页
 * 4. 如果相等，就无需刷新网页，直接显示404
 */
import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import {Result, Button} from "antd";

function NoMatch(props){
    // 创建状态
    const [reFreshed, reFreshedState] = useState(false);

    // 相当于：componnetDidMount, componentDidUpdate等
    useEffect(() => {
        // 获取patahname
        let pathname = props.history.location.pathname;
        let reFreshPathName;

        try {
            // 获取reFreshPathName
            reFreshPathName = window.localStorage.reFreshPathname;
            // 设置reFreshPathname为新的pathname
            window.localStorage.reFreshPathname = pathname;
        }catch(err){
            reFreshPathName = pathname;
        }

        if(pathname !== reFreshPathName){
            // console.log(reFreshPathName, pathname);
            // 刷新网页
            // console.log("reload网页：", reFreshPathName, pathname)
            window.location.reload();
        }else{
            // 无需刷新
            // console.log("无需刷新：", pathname);
            // 网页有可能是404
            reFreshedState(true);

        }
    }, [props, reFreshed]);

    return (
        <div>
            {
            reFreshed ?  
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, 您要访问的页面不存在."
                    extra={<Link to="/"><Button type="primary">返回首页</Button></Link>}
                /> 
            : null
            }
        </div>
    );
}
export default NoMatch;