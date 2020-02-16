/**
 * 左右布局左侧的内容
 */
import React, {useCallback} from "react"

import Icon from "./Icon";

function LeftSider({setShowLeftSider}){

    const toogleLeftSider = useCallback((e) => {
        e.preventDefault();
        setShowLeftSider(prevState => {
            localStorage.setItem("showLeftSider", !prevState);
            return !prevState;
        });
    }, [setShowLeftSider]);

    return (
        <div className="left-sider">
            <div className="header">
                <div className="namespace">
                    <div className="logo">
                        <img alt="logo"
                          src="https://www.codelieche.com/static/images/logo-kanban.svg">
                        </img>
                    </div>
                    <div className="toogle" onClick={toogleLeftSider}>
                        <Icon type="angle-double-left" noMarginRight={true}></Icon>
                    </div>
                </div>
            </div> 

            <div className="content">
                主体内容
            </div> 

            <div className="footer">
                底部内容
            </div>    
        </div>
    );
}
export default LeftSider;