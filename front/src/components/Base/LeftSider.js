/**
 * 非文章相关的左侧
 * 左右布局左侧的内容:
 */
import React, {useState, useEffect, useCallback, useMemo} from "react"
import { Link } from "react-router-dom";
import { Layout} from "antd";
import { Resizable } from 'react-resizable';

// import { GlobalContext } from "./Context";
import Icon from "./Icon";
import { LeftSiderNav } from "./LeftNav";

function LeftSider({showLeftSider, setShowLeftSider, defaultOpenKey}){
    // 导航是否收缩
    const [ collapsed, setCollapsed] = useState(null);

    // 刷新导航相关的操作
    // const { setRefreshNavTimes, history } = useContext(GlobalContext);

    let widthInit = useMemo(() => {
        // 从localStorage中获取宽度
        let widthValue = localStorage.getItem("leftSiderWidth");

        let result = parseInt(widthValue);
        // console.log(widthValue, isNaN(widthValue), typeof widthValue, result);
        if(result){
            return (result >= 156 && result <= 460) ? result : 200;
        }else{
            return 200;
        }
    }, []);

    // 左侧导航的宽度
    const [width, setWidth] = useState(widthInit);

    useEffect(() => {
        // 组件要卸载的时候，储存一下宽度
        return () => {localStorage.setItem("leftSiderWidth", width);}
    }, [width])

    const onResize = useCallback((event, { element, size }) => {
        // console.log(size.width);
        // 左边栏最小156px；最大460px；
        if(size.width < 156){
            setWidth(156);
            return;
        }
        
        if(size.width <= 460){
            setWidth(size.width);
            // 组件要卸载的时候才保存，如果每次保存会影响性能
        }else{
            setWidth(460);
        }
      }, [setWidth]);
    
    // 显示左侧导航开关
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
             <LeftSiderNav collapsed={collapsed} defaultOpenKey={defaultOpenKey} />
            );
        }else{
            return null;
        }
    }, [showLeftSider, collapsed, defaultOpenKey]);

    // 导航收缩开关
    const handleCollapsedToogle = useCallback(() => {
        setCollapsed(prevState => !prevState);
    }, [setCollapsed])

    // 保存收缩信息
    useEffect(() => {
        // 从localStorate中获取数据
        // console.log(collapsed);
        if(collapsed === null){
            let value = localStorage.getItem("leftSiderNavCollapsed");
            if(value === null){
                // 如果不存在，那么也设为显示侧边栏
                setCollapsed(false);
            }else{
                setCollapsed(value === "true" ? true : false);
            }
        }
        localStorage.setItem("leftSiderNavCollapsed", collapsed);
        return () => {
            // 写入localStorate中
            localStorage.setItem("leftSiderNavCollapsed", collapsed);
        }
    }, [collapsed])

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