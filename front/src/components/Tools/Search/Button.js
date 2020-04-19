/**
 * 搜索按钮
 */
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
    Input
} from "antd";

import Icon from "../../Base/Icon";


// 右侧头部的搜索按钮
// 1. 开始只是现实个搜索的Icon
// 2. 鼠标移动上去后，自动显示Input
// 3. 当鼠标移除.header .search的时候，又变成只显示Icon了
// 4. onSearch的时候，跳转到/tools/search?search=value页面
export const HeaderSearchButton = ({history}) => {
    // 状态
    const [showInput, setShowInput ] = useState(false);
    const [value, setValue] = useState("");

    const handleOnChange = useCallback(e => {
        // console.log(e.target.value);
        setValue(e.target.value);
    }, [])

    const handleOnSearch = useCallback((value) => {
        // console.log(history);
        let url = `/tools/search?search=${value}`;
        history.push(url);
    }, [history])

    if( !showInput ){
        return (
            <div className="search" 
              onMouseEnter={() => {setShowInput(true)}}
            >
                <Icon type="search" />
            </div>
        );
    }
    return (
        <div className="search" 
          onMouseLeave={() => {setShowInput(false)}}>
            <Input.Search 
              value={value}
              allowClear={true}
              onChange={handleOnChange}
              onSearch={handleOnSearch}
            />
        </div>
    )
}

HeaderSearchButton.propTypes = {
    history: PropTypes.object.isRequired
}
