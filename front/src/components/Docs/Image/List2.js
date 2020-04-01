/**
 * 图片列表页：瀑布流
 */
import React, { useState, useMemo, useCallback, useEffect } from "react";

import {
    Row, Button, Modal
} from "antd";

import Icon from "../../Base/Icon";
import { copyTextFunc } from "../../Page/Copy";
import BasePaginationData from "../../Page/BasePaginationData";

const ShowImageModal = ({visible, data, afterCloseHandle}) => {

    const handleOnOkOrCancel = useCallback((e) => {
        if(afterCloseHandle){
            afterCloseHandle();
        }
    }, [afterCloseHandle])

    const imageElement = useMemo(() => {
        if((data && data.id > 0) && (data.file || data.qiniu)){
            return (
                <img src={data.qiniu ? data.qiniu : data.file} alt="图片" />
            );
        }else{
            return null;
        }
    }, [data])

    return (
        <Modal
          width="100%"
          visible={visible}
          wrapClassName="show-image-modal"
          bodyStyle={{height: "100%", width: "100%", boxSizing: "border-box"}}
          style={{top: "0", width: "100%"}}
          onOk={handleOnOkOrCancel}
          onCancel={handleOnOkOrCancel}
          footer={null}
        >
            <div className="show-image" style={{display: visible ? "block" : "none"}}>
                {/* <img src={data.file} alt="图片" /> */}
                {imageElement}
            </div>
          </Modal>
    );
}

export const ImageListPage = (props) => {
    // 状态
    const [dataSource, setDataSource] = useState([]);

    const listRef = useMemo(() => React.createRef(), []);
    // 展示图片的列
    const [ columnNumber, setColumnNumber ] = useState(3);
    // 显示图片的modal
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImage, setCurrentImage] = useState({});

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

    // 数据变更的时候，计算列
    useEffect(() => {
        // console.log(listRef)
        if(listRef && listRef.current){
            let columnCount = Math.ceil((listRef.current.offsetWidth - 60) / 270);
            if(columnCount !== columnNumber){
                setColumnNumber(columnCount > 1 ? columnCount : 1);
            }
        }
    // 手动增加了dataSource到第二个参数中，这样当数据变化，就会计算
    }, [columnNumber, listRef, dataSource])

    // 点击图片，显示图片的modal
    const showImageToogle = useCallback( data => {
        setCurrentImage(data);
        setShowImageModal(true);
    }, []);

    // 复制图片按钮
    const handleOnCopyClick = useCallback((event, title, content) => {
        event.stopPropagation();   // 防止冒泡
        // 执行复制操作
        copyTextFunc(title, content);
    }, [])

    // 图片瀑布流
    const dataSourceElements = useMemo(() => {
        // 测试
        // if(dataSource.length > 0){
        //     showImageToogle(dataSource[0])
        // }
        
        return dataSource.map((item,index) => {
            return (
                <div className="image-item" key={item.id} onClick={() => showImageToogle(item)}>
                    <div className="item-inner">
                        <img src={item.file} alt="图片" />
                        <div className="buttons">
                            <Button type="link" size="small" onClick={ (e) => {handleOnCopyClick(e, "图片链接", item.qiniu ? item.qiniu : item.file)}}>
                                <Icon type="copy" />链接
                            </Button>
                            <Button type="link" size="small" onClick={ (e) => {handleOnCopyClick(e, "Markdown", `![${item.filename}](${item.qiniu ? item.qiniu : item.file})`)}}>
                                <Icon type="copy" />Markdown
                            </Button>
                            
                            {/* <Button type="link" size="small" danger>
                                <Icon type="trash-o" /> 删除
                            </Button> */}
                        </div>
                    </div>
                </div>
            );
        })
    }, [dataSource, handleOnCopyClick, showImageToogle])

    // 当图片modal关闭的时候要做的操作
    const afterCloseHandle = useCallback(() => {
        // 不显示modal
        setShowImageModal(false);
        setCurrentImage({});
    }, [])

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

            {/* 展示图片的modal */}
            <ShowImageModal 
              visible={showImageModal}
              data={currentImage} 
              afterCloseHandle={afterCloseHandle} />
        </div>
    )
}

export default ImageListPage;
