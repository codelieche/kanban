/**
 * 导航菜单的列表页
 */
import React, {useState, useEffect, useCallback, useContext, useMemo} from "react";
import {
    Button,
    Modal,
    Row, message
} from "antd";

import Icon from "../../Base/Icon";
import { GlobalContext } from "../../Base/Context";
import { checkUserPermission } from "../../Utils/auth";
import BaseTable from "../../Page/BaseTable";
import { BaseFormModal } from "../../Page/BaseForm";
import fetchApi from "../../Utils/fetchApi";
// 从表单中选择值【数组】
import CheckValuesFromTable from "../../Base/Forms/CheckTableValues";

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
    const [isAdd, setIsAdd] = useState(false); // 是否是添加菜单
    const [canEdit, setCanEdit] = useState(false);
    // 显示编辑菜单的对话框
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    // 刷新表单数据
    const [reFreshTimes, setReFreshTimes] = useState(0);
    // 显示选择parent的对话框
    const [ showSelectModal, setShowSelectModal] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);

    // 显示编辑modal的表单
    const formRef = useMemo(() => React.createRef(), []);

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
        setIsAdd(false); // 设置为不是编辑
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
                width: 85,
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
                width: 150,
            },
            {
                title: "打开方式",
                dataIndex: "target",
                key: "target",
                width: 100,
            },

            {
                title: "站外",
                dataIndex: "is_link",
                key: "is_link",
                width: 80,
                render: (value, record) => {
                    return (
                        <div className="status">
                            <Icon type={value ? "check" : "close"} />
                        </div>
                    )
                }
            },

            {
                title: "状态",
                dataIndex: "is_deleted",
                key: "id_deleted",
                width: 80,
                render: (value, record) => {
                    return (
                        <div className="status">
                            <Icon type={value ? "close" : "check"} />
                        </div>
                    )
                }
            },
            {
                title: "排序",
                dataIndex: "order",
                key: "order",
                width: 80,
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

    // 右侧按钮
    const rightButtons = useMemo(() => {
        return (
            <span>
                <Button
                    style={{width: 100}}
                    type="default"
                    // icon="reload"
                    icon={<Icon type="refresh"/>}
                    onClick={() => {setReFreshTimes(preState => preState + 1)}}
                >
                    刷新
                </Button>
                
                <Button
                    type="primary"
                    style={{width: 100}}
                    icon={<Icon type="plus"/>}
                    // 显示编辑/添加Modal，
                    onClick={
                        () => {
                            setIsAdd(true);
                            setShowEditModal(true); 
                            setCurrentItem({is_link: false, is_deleted: false, target: "_self"});
                        }}
                    >
                    Add
                </Button>
                
            </span>
        )
}, []);

    // 提交编辑表单
    const handleFormSubbmit = useCallback((values) => {
        // console.log(values);
        // PUT修改标签
        if( !isAdd ){
            if(!values.id){
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
        }else{
            // 添加操作
            let url = `/api/v1/config/menu/create`;
            fetchApi.Post(url, {}, {data: values})
            .then(responseData => {
                if(responseData.id > 0){
                    message.success("添加菜单成功");
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
        }

        
    }, [isAdd])

    // 提交的表单字段
    const formFields = useMemo(() => {
        return [
            {
                type: "input",
                label: "ID",
                disabled: true,
                name: "id",
                hiddle: isAdd,
                required: !isAdd,
                rules: [{required: !isAdd, message: "请输入菜单的ID"}],
            },
            {
                type: "input",
                label: "Key",
                name: "key",
                rules: [{required: true, message: "请输入菜单的Key"}],
                props: {
                    placeholder: "/docs"
                }
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
                props: {
                    placeholder: "angle-right"
                }
            },
            {
                type: "input",
                label: "网址",
                name: "slug",
                rules: [{required: true, message: "请输入菜单对应的网址"}],
                props: {
                    placeholder: "/docs"
                }
            },
            {
                type: "radio.group",
                label: "是否为站外连接",
                name: "is_link",
                rules: [
                    {required: false, message: "请选择是否是外部连接"}
                ],
                choices: [
                    {value: true, text: "站外"},
                    {value: false, text: "站内"},
                ],
                props: {
                    size: "small",
                    buttonStyle: "solid"
                }
            },
            {
                type: "input",
                label: "站外链接",
                name: "link",
            },
            {
                type: "radio.group",
                label: "跳转方式",
                name: "target",
                rules: [{required: false, message: "请输入菜单链接的跳转方式"}],
                choices: [
                    {value: "_self", text: "当前页面"},
                    {value: "_blank", text: "新的页面"},
                ],
                props: {
                    // size: "normal",
                    size: "small",
                    buttonStyle: "solid"
                }
            },
            {
                type: "input",
                label: "父级菜单",
                name: "parent",
                rules: [{required: false, message: "请输入菜单的父级菜单"}],
                props: {
                    addonAfter: <div onClick={(e) => {setShowSelectModal(true); e.stopPropagation();}}>选择</div>
                }
            },
            {
                type: "inputnumber",
                label: "排序",
                name: "order",
                rules: [{required: true, message: "请输入菜单的序号"}],
                props: {
                    min: 1,
                }
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
    }, [isAdd])

    // 选择parent的对话框ok的时候
    const handleSelectModalOk = useCallback(values => {
        // console.log(values);
        setShowSelectModal(false);

        if(selectedValues.length > 0){
            // 可以更新字段
            setCurrentItem({parent: selectedValues[0]})
        }
        
    }, [selectedValues])

    // console.log(selectedValues, currentItem);
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
                rightButtons={rightButtons}  // 右侧按钮
            />

            {/* 编辑表单Modal */}
            {
                canEdit && (
                    <BaseFormModal 
                      title={ isAdd ? "添加导航菜单" : "编辑导航菜单" }
                      buttonName={ isAdd ? "添加" : "提交修改" }
                      formRef={formRef}
                    //   width={650}
                      visible={showEditModal}
                      fields={formFields}
                      data={currentItem}
                      handleAfterClose={handleModelAfterClose}
                      handleSubmit={handleFormSubbmit}
                    />
                )
            }

            {/* 从列表中选择parent的对话框 */}
            <Modal
                title="请选择父级菜单"
                visible={showSelectModal}
                width={"60%"}
                // footer={null}
                onOk={handleSelectModalOk}
                onCancel={() => {setShowSelectModal(false)}}
              >
                  <CheckValuesFromTable
                    selectedValues={selectedValues}         // 当前选中的值
                    setSelectedValues={setSelectedValues} // 修改选中的值
                    dataSourceUrl="/api/v1/config/menu/user?level=1" // 数据源的api
                    columns={columns.slice(0, 7)}                   // 展示列表
                    rowKey="id"
                    isMultiple={false}                  // 是否可选择多个
                    disabledKeys={[currentItem.id]}     // 不可选择的值
                    showSubs={true}                     // 是否显示子元素
                    subsKey="children"
                  />
              </Modal>

        </div>
    )
}

export default MenuListPage;
