/**
 * 标签Key的列表页
 */
import React, {useState, useEffect, useContext, useMemo, useCallback} from "react";
import { Link } from "react-router-dom";
import {
    Row, Divider, Button, message
} from "antd";

import { checkUserPermission } from "../../Utils/auth";
import { GlobalContext } from "../../Base/Context";

import Icon from "../../Base/Icon";
import BaseTable from "../../Page/BaseTable";
import { BaseFormModal } from "../../Page/BaseForm";
import fetchApi from "../../Utils/fetchApi";

export const TagsKeyList = (props) => {
    // 状态
    const [canEditor, setCanEditor] = useState(null);
    // 显示编辑对话框
    const [showEditModal, setShowEditModel] = useState(false);
    // 当前的标签数据
    const [currentItem, setCurrentItem] = useState({});
    // 刷新表单数据
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
                title: "标签Key",
                link: "/tags/key"
            },
            {
                title: "列表"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    // 检查能否编辑的标签
    useEffect(() => {
        // 检查权限
        checkUserPermission("tags.change_tag", setCanEditor)
    }, [])

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "is_hot", "is_deleted"]
    }, [])

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["is_hot", "is_deleted"]
    }, [])

    // 编辑点击事件
    const handleShowEditorModal = useCallback(data => {
        setShowEditModel(true);
        setCurrentItem(data);
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
                },
                filters: [
                    { text: "热门", value: "true" },
                    { text: "普通", value: "false" }
                  ],
                  filterMultiple: false,
                  onFilter: (value, record) => record.is_hot.toString() === value
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
                // width: 280,
                ellipsis: true,
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => {
                    return (
                        <span>
                            {
                                canEditor && (
                                    <Button type="link" size="small" onClick={() => handleShowEditorModal(record)}>
                                        <Icon type="edit"/>编辑
                                    </Button>
                                )
                            }
                            <Link to={`/tags/value/list?key=${record.id}`}>
                                <Icon type="tags"></Icon>Value列表
                            </Link>
                            <Divider type="vertical" />
                            <Link to={`/tags/objecttag/list?tagvalue__key_id=${record.id}`}>
                                <Icon type="link"></Icon>对象列表
                            </Link>
                        </span>
                    )
                }
            }
        ]
    }, [canEditor, handleShowEditorModal])

    // 处理关闭表单
    const handleModelAfterClose = useCallback(() => {
        setShowEditModel(false);
        setCurrentItem({});
    }, [])

    // 提交编辑表单
    const handleFormSubbmit = useCallback((values) => {
        // console.log(values);
        // PUT修改标签
        if( !values.id){
            message.warn("传入的id为空");
            return
        }
        let url = `/api/v1/tags/key/${values.id}`;
        fetchApi.Put(url, {}, {data: values})
          .then(responseData => {
              if(responseData.id > 0){
                  message.success("修改标签Key成功");
                  setShowEditModel(false);
                  setCurrentItem({});
                  // 刷新页面
                  setReFreshTimes(prevState => prevState + 1);
              }else{
                  message.warn("编辑标签Key失败");
              }
          })
            .catch(err => {
                message.error("编辑标签Key出错！");
                console.log(err);
            })
        
    }, [])

    // 提交的表单字段
    const formFields = useMemo(() => {
        return [
            {
                type: "input",
                label: "ID",
                disabled: true,
                name: "id",
                required: true,
                rules: [{required: true, message: "请输入标签的ID"}],
            },
            {
                type: "input",
                label: "Key",
                name: "key",
                disabled: true,
                rules: [{required: true, message: "请输入标签的Key"}],
            },
            {
                type: "input",
                label: "名字",
                name: "name",
                rules: [{required: true, message: "请输入标签Key的名字"}],
                props: {
                    allowClear: true,
                    placeholder: "Key的名字"
                }
            },
            {
                type: "switch",
                label: "热门",
                name: "is_hot",
                rules: [{required: true, message: "是否热门"}],
                props: {
                    checkedChildren: "热门",
                    unCheckedChildren: "普通"
                }
            },
            {
                type: "textarea",
                label: "描述",
                name: "description",
                rules: [{required: false, message: "请输入Key的描述"}],
                props: {
                    // allowClear: true,
                    placeholder: "请输入Key的描述",
                    autoSize: {
                        minRows: 2,
                        maxRows: 4,
                    }
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
                    reFreshTimes={reFreshTimes}  // 控制刷新
                />
            </div>

            {/* 编辑的表单 */}
            {
                canEditor && (
                    <BaseFormModal 
                      title="编辑标签Key"
                      buttonName="提交修改"
                    //   width={650}
                      visible={showEditModal}
                      fields={formFields}
                      data={currentItem}
                      handleAfterClose={handleModelAfterClose}
                      handleSubmit={handleFormSubbmit}
                    />
                )
            }
            
        </div>
    )
}

export default TagsKeyList;