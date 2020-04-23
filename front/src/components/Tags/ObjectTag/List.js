/**
 * 对象标签的列表页
 */
import React, {useState, useEffect, useCallback, useContext, useMemo} from "react";

import {
    Button, Row, Popconfirm, Divider, message
} from "antd";

import { GlobalContext } from "../../Base/Context";
import Icon from "../../Base/Icon";
import { checkUserPermission } from "../../Utils/auth";
import BaseTable from "../../Page/BaseTable";
import { deleteObjectTag } from "../../Page/Tags";

export const ObjcetTagList = (props) => {
    // 状态
    const [canEdit, setCanEdit] = useState(false);
    // 控制刷新
    const [reFreshTimes, setReFreshTimes] = useState(0);

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
                title: "对象标签",
                link: "/tags/objecttag"
            },
            {
                title: "列表"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    // 检查用户能否编辑ObjectTag
    useEffect(() => {
        checkUserPermission("tags.change_objecttag", setCanEdit);
    }, [])

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "is_deleted", "tagvalue", "tagvalue__key_id", "tagvalue__key_key", "model"]
    }, [])

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["is_hot", "is_deleted", "model"]
    }, [])

    // 取消删除
    const handleDeleteCancel = useCallback(() => {
        message.info("取消删除");
    }, []);

    // 删除对象标签
    const handleDeleteObjectTag = useCallback((id) => {
        deleteObjectTag(id, () => {
            setReFreshTimes(prevState => prevState + 1);
        })
    }, []);

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
                width: 120,
                filters: [
                    { text: <Icon type="file-text-o"> 文章</Icon>, value: "article" },
                    { text: <Icon type="image"> 图片</Icon>, value: "image" }
                  ],
                  filterMultiple: false,
            },
            {
                title: "Object ID",
                dataIndex: "object_id",
                key: "object_id",
                ellipsis: true,
                width: 120,
                sorter: (a, b) => {}
            },
            {
                title: "添加者",
                dataIndex: "user",
                key: "user",
                ellipsis: true,
                width: 120,
                sorter: (a, b) => {}
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
                },
                filters: [
                    { text: "有效", value: "false" },
                    { text: "禁用", value: "true" }
                  ],
                  filterMultiple: false,
                  onFilter: (value, record) => record.is_deleted.toString() === value
            },
            {
                title: "操作",
                key: "action",
                ellipsis: true,
                render: (text, record) => {
                    return (
                        <span>
                            {
                                canEdit && (
                                    <Popconfirm 
                                      title={`确定删除(${record.app_label}-${record.model}-${record.object_id})的标签(${record.key}-${record.value})`}
                                      onCancel={handleDeleteCancel} 
                                      onConfirm={() => handleDeleteObjectTag(record.id)}>
                                        <Button type="link" size="small" danger>
                                            <Icon type="trash-o"/>删除
                                        </Button>
                                    </Popconfirm>
                                    
                                )
                            }
                            <Divider type="vertical"/>
                            对象信息
                        </span>
                    )
                }
            }
        ]
    }, [canEdit, handleDeleteCancel, handleDeleteObjectTag])

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
                    reFreshTimes={reFreshTimes}  // 控制刷新的
                />
            </div>
            
        </div>
    )
}

export default ObjcetTagList;