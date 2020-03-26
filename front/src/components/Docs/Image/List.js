/**
 * 图片列表页
 */
import React, { useMemo } from "react";

import {
    Row,
    Dropdown
} from "antd";

// import Icon from "../../Base/Icon";
import BaseTable from "../../Page/BaseTable";

export const ImageListPage = (props) => {
    // 状态
    
    // paramsFields字段：通过url可获取到哦的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "parent", "is_deleted"];
    }, []);

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["user", "is_deleted"]
    }, [])

    // 表格的列数据
    const columns = useMemo(() => {
        return [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a, b) => {},
                // render: (text, record) => {
                //     return <Link to={`/docs/article/${text}`}>{text}</Link>;
                // },
                width: 70,
            },
            {
                title: "图片名字",
                dataIndex: "filename",
                key: "filename",
                width: 120,
                ellipsis: true,
            },
            {
                title: "上传者",
                dataIndex: "user",
                key: "user",
                width: 100,
                ellipsis: true,
            },
            {
                title: "图片",
                dataIndex: "file",
                key: "file",
                width: 200,
                ellipsis: true,
                render: (text, record) => {
                    let imageElement = (
                        <img 
                          style={{maxWidth: 550, height: "auto", borderRadius: 5, maxHeight: 400, overflowY: "auto"}}
                          src={text} 
                          alt={record.filename} />
                    );

                    if(text){
                        return (
                            <Dropdown overlay={imageElement}>
                                <div>{text}</div>
                            </Dropdown>
                        )
                    }else{
                        return <span>---</span>
                    }
                }
            },
            {
                title: "七牛",
                dataIndex: "qiniu",
                key: "qiniu",
                width: 200,
                ellipsis: true,
                render: (text, record) => {
                    let imageElement = (
                        <img 
                          style={{maxWidth: 550, height: "auto"}}
                          src={text} 
                          alt={record.filename} />
                    );

                    if(text){
                        return (
                            <Dropdown overlay={imageElement}>
                                <div>{text}</div>
                            </Dropdown>
                        )
                    }else{
                        return <span>---</span>
                    }
                }
            },
            {
                title: "时间",
                dataIndex: "time_added",
                key: "time_added",
                sorter: (a, b) => {},
                width: 180,
                ellipsis: true,
            },
            {
                title: "操作",
                key: "action",
                ellipsis: true,
            },
        ]
    }, []);

    return (
        <div className="content">
            <div className="main">
                <Row className="title">
                    <h4>图片列表</h4>
                </Row>

                <BaseTable
                    columns={columns}
                    filterColumns={filterColumns} // filter会用到
                    paramsFields={paramsFields}  // url传递的参数
                    location={props.location}
                    history={props.history}
                    apiUrlPrefix="/api/v1/docs/image/list"
                    pageUrlPrefix="/docs/image/list"
                />
            </div>

        </div>
    )
}

export default ImageListPage;
