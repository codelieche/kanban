/**
 * 加载页
 */
import React from "react";
import {
    Spin
} from "antd";

export const LoadingPage = (props) => {
    return (
        <div className="loading">
            <div>
                <Spin size={props.size ? props.size : "default"} />
                <div className="message">
                    {props.message ? props.message : "数据加载中..."}
                </div>
            </div>

        </div>
    );
}

export default LoadingPage;