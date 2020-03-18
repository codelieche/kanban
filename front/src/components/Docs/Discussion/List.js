/**
 * 文档讨论列表页
 */
import React, { useMemo } from "react";
// import { Link } from "react-router-dom";

import {
    Row,
} from "antd";

import Icon from "../../Base/Icon";
import BaseTable from "../../Page/BaseTable";

export const DiscussionListPage = (props) => {
    // 状态

    // params字段:通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "parent", "is_deleted"];
    }, []);

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["is_deleted"]
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
                width: 50,
            },
            {
                title: "类型",
                dataIndex: "category",
                key: "category",
                width: 100,
                ellipsis: true,
            },
    
            {
                title: "内容",
                dataIndex: "content",
                key: "content",
                width: 260,
                ellipsis: true,
            },
            {
                title: "用户",
                dataIndex: "user",
                key: "user",
                width: 100,
            },
            {
                title: "时间",
                dataIndex: "time_added",
                key: "time_added",
                width: 180,
                ellipsis: true,
            },
            {
                title: "状态",
                dataIndex: "is_deleted",
                key: "is_deleted",
                width: 100,
                render: (text, record) => {
                    // console.log(text, record);
                    if(!text){
                        return (
                            <span className="status">
                                <Icon type="check" />
                            </span>
                        )
                    }else{
                        return (
                            <span className="status">
                                <Icon type="close" />
                            </span>
                        )
                    }
                },
                filterMultiple: false,
                filters: [
                    { text: "有效", value: "false" },
                    { text: "已删除", value: "true" }
                  ],
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => {
                    return (
                        <div>
                            <span>-</span>
                        </div>
                    )
                }
            }
        ]
    }, []);

    return (
        <div className="content">
            <div className="main">
                <Row className="title">
                    <h4>讨论列表</h4>
                </Row>

                <BaseTable
                  columns={columns} 
                  filterColumns={filterColumns}  // filter会用到
                  paramsFields={paramsFields}  // url传递的参数
                  location={props.location}
                  history={props.history}
                  apiUrlPrefix="/api/v1/docs/discussion/list"
                  pageUrlPrefix="/docs/discussion/list"
                />
            </div>
        </div>
    )
}

export default DiscussionListPage;