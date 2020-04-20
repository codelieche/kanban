/**
 * 导航菜单的列表页
 */
import React, {useState, useEffect, useCallback, useContext, useMemo} from "react";
import {
    Button,
    Row, message
} from "antd";

import Icon from "../../Base/Icon";
import { GlobalContext } from "../../Base/Context";
import { checkUserPermission } from "../../Utils/auth";
import BaseTable from "../../Page/BaseTable";
import { BaseFormModal } from "../../Page/BaseForm";
import fetchApi from "../../Utils/fetchApi";

export const MenuListPage = (props) => {
    // 设置导航
    const { setNavData } = useContext(GlobalContext);
    // 设置顶部的导航
    useEffect(() => {
        setNavData([
            {
                title: "首页",
                icon: "home",
                link: "/"
            },
            {
                title: "配置",
            },
            {
                title: "导航",
                link: "/config/link"
            }
        ])
    }, [setNavData])

    return (
        <div className="content">
            <div className="main">
                <MenuList {...props} />
            </div>
        </div>
    )
}

// 菜单列表页的主体内容
export const MenuList = (props) => {
    // 状态

    // 用户能否编辑菜单
    const [canEdit, setCanEdit] = useState(false);
    // 显示编辑菜单的对话框
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    // 刷新表单数据
    const [reFreshTimes, setReFreshTimes] = useState(0);

    // 检查用户是否有编辑的权限
    useEffect(() => {
        // 检查权限
        checkUserPermission("config.change_menu", setCanEdit);
    }, [])

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "is_active"]
    }, [])

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["is_active", "is_deleted"]
    }, [])

    // 点击编辑事件
    const handleShowEditModal = useCallback(data => {
        setShowEditModal(true);
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
                width: 75,
            },
            {
                title: "图标",
                dataIndex: "icon",
                key: "icon",
                width: 120,
            },
            {
                title: "菜单标题",
                dataIndex: "title",
                key: "title",
                width: 120,
            },
            {
                title: "网址",
                dataIndex: "slug",
                key: "slug",
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => {
                    return (
                        <span>
                            {
                                canEdit && (
                                    <Button type="link" size="small" onClick={() => handleShowEditModal(record)}>
                                        <Icon type="edit"/>编辑
                                    </Button>
                                )
                            }
                        </span>
                    )
                }
            }
        ]
    }, [canEdit, handleShowEditModal])

    // 处理关闭表单
    const handleModelAfterClose = useCallback(() => {
        setShowEditModal(false);
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
        let url = `/api/v1/config/menu/${values.id}`;
        fetchApi.Put(url, {}, {data: values})
          .then(responseData => {
              if(responseData.id > 0){
                  message.success("修改菜单成功");
                  setShowEditModal(false);
                  setCurrentItem({});
                  // 刷新页面
                  setReFreshTimes(prevState => prevState + 1);
              }else{
                  message.warn("编辑菜单失败");
              }
          })
            .catch(err => {
                message.error("编辑菜单出错！");
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
                rules: [{required: true, message: "请输入菜单的ID"}],
            },
            {
                type: "input",
                label: "Key",
                name: "key",
                rules: [{required: true, message: "请输入菜单的Key"}],
            },
            {
                type: "input",
                label: "菜单标题",
                name: "title",
                rules: [{required: true, message: "请输入菜单的标题"}],
            },
            {
                type: "input",
                label: "图标",
                name: "icon",
                rules: [{required: true, message: "请输入菜单的图标"}],
            },
            {
                type: "input",
                label: "网址",
                name: "slug",
                rules: [{required: true, message: "请输入菜单对应的网址"}],
            },
            {
                type: "switch",
                label: "是否为站外连接",
                name: "is_link",
                rules: [
                    {required: false, message: "请选择是否是外部连接"}
                ],
                props: {
                    checkedChildren: "站外",
                    unCheckedChildren: "站内"
                }
            },
            {
                type: "input",
                label: "跳转方式",
                name: "target",
                rules: [{required: false, message: "请输入菜单链接的跳转方式"}],
            },
            {
                type: "input",
                label: "父级菜单",
                name: "parent",
                rules: [{required: false, message: "请输入菜单的父级菜单"}],
            },
            {
                type: "input",
                label: "排序",
                name: "order",
                rules: [{required: true, message: "请输入菜单的父级菜单"}],
            },
            {
                type: "switch",
                label: "状态",
                name: "is_deleted",
                rules: [
                    {required: false, message: "请选择是否是外部连接"}
                ],
                props: {
                    checkedChildren: "禁用",
                    unCheckedChildren: "有效"
                }
            },

        ]
    }, [])



    return (
        <div>
            <Row className="title">
                <h4>导航菜单列表</h4>
            </Row>

            {/* 显示标签key列表 */}
            <BaseTable
                columns={columns}
                filterColumns={filterColumns} // filter会用到
                paramsFields={paramsFields}  // url传递的参数
                location={props.location}
                history={props.history}
                apiUrlPrefix="/api/v1/config/menu/user"
                pageUrlPrefix="/tags/menu/list"
                reFreshTimes={reFreshTimes}  // 控制刷新
            />

            {/* 编辑表单Modal */}
            {
                canEdit && (
                    <BaseFormModal 
                      title="编辑导航菜单"
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

export default MenuListPage;
