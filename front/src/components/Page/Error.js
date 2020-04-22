/**
 * 渲染错误页
 */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
    Button,
    Result
} from "antd";

// 渲染错误页面
export const RendeErrorPage = ({errorCode, title, subTitle, pathname}) => {

    if( !!errorCode && errorCode > 0){
        // 需要渲染错误页面
        if(errorCode === 403){
            return (
                <Result status="403" title={title ? title : "403"}
                    subTitle={subTitle ? subTitle : `Sorry，您暂时无权限访问本页面:${pathname}`}
                    extra={(
                        <Button type="primary">
                            <Link to="/">返回首页</Link>
                        </Button>
                    )}
                />
            )
        }else if(errorCode === 404){
            return (
                <Result status="404" title={title ? title : "404"}
                    subTitle={subTitle ? subTitle : `Sorry，您访问的页面不存在:${pathname}`}
                    extra={(
                        <Button type="primary">
                            <Link to="/">返回首页</Link>
                        </Button>
                    )}
                />
            )
        }else{
            return null;
        }
    }
}

RendeErrorPage.propTypes = {
    errorCode: PropTypes.number.isRequired,
    title: PropTypes.string,
    subTitle: PropTypes.elementType,
    pathname: PropTypes.string.isRequired
}

export default RendeErrorPage;
