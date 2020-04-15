/**
 * 标签Key的列表页
 */
import React, {useEffect, useContext, useMemo} from "react";
import { Link } from "react-router-dom";
import {
    Row
} from "antd";

import { GlobalContext } from "../../Base/Context";

import Icon from "../../Base/Icon";
import BaseTable from "../../Page/BaseTable";

export const TagsKeyList = (props) => {

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
                title: "标签Key",
                link: "/tags/key"
            },
            {
                title: "列表"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "is_hot", "is_deleted"]
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
                key: "_key",
                width: 120,
                ellipsis: true,
            },
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
                ellipsis: true,
                width: 120
            },
            {
                title: "热门",
                dataIndex: "is_hot",
                key: "is_hot",
                width: 100,
                render: (text, record) => {
                    return (
                        <span className="status">
                            <Icon type={text ? "check" : "close"} />
                        </span>
                    )
                }
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
                title: "添加时间",
                dataIndex: "time_added",
                key: "time_added",
                width: 180,
                ellipsis: true,
            },
            {
                title: "描述",
                dataIndex: "description",
                key: "description",
                width: 280,
                ellipsis: true,
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => {
                    return (
                        <span>
                            <Link to={`/tags/value/list?key=${record.id}`}>
                                <Icon type="tags">Value列表</Icon>
                            </Link>
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
                    <h4>标签Key列表</h4>
                </Row>
                
                {/* 显示标签key列表 */}
                <BaseTable
                    columns={columns}
                    filterColumns={filterColumns} // filter会用到
                    paramsFields={paramsFields}  // url传递的参数
                    location={props.location}
                    history={props.history}
                    apiUrlPrefix="/api/v1/tags/key/list"
                    pageUrlPrefix="/tags/key/list"
                />
            </div>
            
        </div>
    )
}

export default TagsKeyList;