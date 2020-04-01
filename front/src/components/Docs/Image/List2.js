/**
 * 图片列表页：瀑布流
 */
import React, { useState, useMemo, useCallback, useEffect } from "react";

import {
    Row,
} from "antd";

// import Icon from "../../Base/Icon";
import BasePaginationData from "../../Page/BasePaginationData";

export const ImageListPage = (props) => {
    // 状态
    const [dataSource, setDataSource] = useState([]);

    const listRef = useMemo(() => React.createRef(), []);

    const [ columnNumber, setColumnNumber ] = useState(3);

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "page_size", "search", "ordering", "parent", "is_deleted"];
    }, []);

    // 渲染数据
    const renderItemFunc = useCallback((item) => {
        return (
            <div className="image-item" key={item.id} style={{display: "inline-block", padding: "15px 10px"}}>
                <img src={item.file} alt="图片" style={{maxWidth: 200}} />
            </div>
        )
    }, []);

    useEffect(() => {
        
    }, [])

    const dataSourceElements = useMemo(() => {
        // console.log(listRef)
        if(listRef && listRef.current){
            let columnCount = Math.ceil((listRef.current.offsetWidth - 60) / 270);
            setColumnNumber(columnCount > 1 ? columnCount : 1);
        }
        return dataSource.map((item,index) => {
            return (
                <div className="image-item" key={item.id}>
                    <div className="item-inner">
                        <img src={item.file} alt="图片" />
                    </div>
                </div>
            )
        })
    }, [dataSource, listRef])

    return (
        <div className="content">
            <div className="main">
                <Row className="title">
                    <h4>图片列表</h4>
                </Row>

                <BasePaginationData
                    showTools={true}
                    paramsFields={paramsFields}  // url传递的参数
                    location={props.location}
                    history={props.history}
                    apiUrlPrefix="/api/v1/docs/image/list"
                    pageUrlPrefix="/docs/image/list"
                    setDataSource={setDataSource} // 把分页获取到数据追加到当前页面来
                    renderItem={renderItemFunc} // 渲染每一项
                    pageSize={20}
                    hideOnSinglePage={false} // 当只有一页的时候，是否隐藏
                >
                    {/* 图片列表数据 */}
                    <div className="images-list" ref={listRef} style={{columnCount: columnNumber}}>
                        {dataSourceElements}
                    </div>
                </BasePaginationData>
            </div>

        </div>
    )
}

export default ImageListPage;
