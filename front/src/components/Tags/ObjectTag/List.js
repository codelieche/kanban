/**
 * 对象标签的列表页
 */
import React, {useEffect, useContext, useMemo} from "react";

import {
    Row
} from "antd";

import { GlobalContext } from "../../Base/Context";
import Icon from "../../Base/Icon";
import BaseTable from "../../Page/BaseTable";

export const ObjcetTagList = (props) => {

    // 全局设置导航的函数
    const { setNavData } = useContext(GlobalContext);

    // 顶部导航面包屑的数据
    // 设置导航
    useEffect(() => {
        const navData = [
            {
                title: "首页",
                icon: "home",
                link: "/"
            },
            {
                title: "标签值",
                link: "/tags/value"
            },
            {
                title: "列表"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "is_deleted", "tagvalue", "tagvalue__key"]
    }, [])

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["is_hot", "is_deleted"]
    }, [])

    // 表格的列数据
    const columns = useMemo(() => {
        return [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a, b) => {},
                width: 70,
            },
            {
                title: "Key",
                dataIndex: "key",
                key: "key__key",
                width: 120,
                ellipsis: true,
            },
            {
                title: "Value",
                dataIndex: "value",
                key: "value",
                ellipsis: true,
                width: 120
            },
            {
                title: "App Label",
                dataIndex: "app_label",
                key: "app_label",
                ellipsis: true,
                width: 120
            },
            {
                title: "Model",
                dataIndex: "model",
                key: "model",
                ellipsis: true,
                width: 120
            },
            {
                title: "Object ID",
                dataIndex: "object_id",
                key: "object_id",
                ellipsis: true,
                width: 100
            },
            {
                title: "状态",
                dataIndex: "is_deleted",
                key: "is_deleted",
                width: 100,
                render: (text, record) => {
                    return (
                        <span className="status">
                            <Icon type={text ? "close" : "check"} />
                        </span>
                    )
                }
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => {
                    return (
                        <span>
                            ---
                        </span>
                    )
                }
            }
        ]
    }, [])

    return (
        <div className="content">
            <div className="main">
                <Row className="title">
                    <h4>标签值列表</h4>
                </Row>
                {/* 显示对象标签列表 */}
                <BaseTable
                    columns={columns}
                    filterColumns={filterColumns} // filter会用到
                    paramsFields={paramsFields}  // url传递的参数
                    location={props.location}
                    history={props.history}
                    apiUrlPrefix="/api/v1/tags/objecttag/list"
                    pageUrlPrefix="/tags/objecttag/list"
                />
            </div>
            
        </div>
    )
}

export default ObjcetTagList;