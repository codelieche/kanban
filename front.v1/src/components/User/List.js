/**
 * 新版本用户列表页
 */
import React, { useState, useCallback, useMemo, useContext, useEffect } from "react";

import {
    Button,
    Popconfirm,
    Row,
    message,
    Divider
} from "antd";

import { GlobalContext } from "../Base/Context";
import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";
import BaseTable from "../Page/BaseTable";

import UserEditorModal from "./EditorModal";

export const UserListPage = (props) => {
    // 状态
    const [visible, setVisible] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [currentUser, setCurrentUser ] = useState({});
    const [ reFreshTimes, setReFreshTimes ] = useState(0);
    const { setNavData } = useContext(GlobalContext);

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "is_active", "can_view", "is_superuser"]
    }, [])

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["is_active", "can_view", "is_superuser"]
    }, [])

    const editorOnClick = useCallback(user => {
        setVisible(true);
        setCurrentUser(user);
      }, [])
    
      const deleteOnCancel = useCallback(e => {
        // 选择取消的话，也弹出消息
        message.error("取消删除", 3);
      }, [])
    
      const deleteOnConfirm = useCallback(value => {
        // 开始删除
        const url = `/api/v1/account/user/${value.id}`;
        // 通过delete删除用户
        fetchApi.Delete(url)
          .then(response => {
            //   查看status状态码
            if (response.status === 204) {
              message.success("删除" + value.username + "成功！", 3);
              // 刷新数据
                setReFreshTimes(prevState => prevState + 1)
            } else if (response.status === 200) {
              return response.json();
            } else {
              message.error(`删除${value.username}失败`, 3);
              return response.json();
            }
          })
          .then(data => {
            if (data) {
              if (data.message) {
                message.warn(data.message, 8);
              } else {
                message.error(JSON.stringify(data), 3);
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }, []);

    const resetCurretUserState = useCallback(reFresh => {
        // 重新设置user和visible
        setVisible(false);
        setCurrentUser({});

        if (reFresh !== false) {
            // fetchData();
            // 控制刷新数据
            setReFreshTimes(prevState => prevState + 1);
        }
       
      }, []);
    
      const changeShowDelete = useCallback(() => {
        // 改变showDelete的值
        setShowDelete(prevState => !prevState);
      }, []);

    // 表格的列数据
    const columns = useMemo(() => {
        return [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a, b) => a.id - b.id
              },
              {
                title: "用户名",
                dataIndex: "username",
                key: "username"
              },
              {
                title: "状态",
                dataIndex: "is_active",
                key: "is_active",
                render: value => {
                  if (value) {
                    return (
                      <div className="status">
                        <Icon type="check" />
                      </div>
                    );
                  } else {
                    return (
                      <span className="status">
                        <Icon type="close" />
                      </span>
                    );
                  }
                },
                filters: [
                  { text: "启用", value: "true" },
                  { text: "禁用", value: "false" }
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.is_active.toString() === value
              },
              {
                title: "访问本站",
                dataIndex: "can_view",
                key: "can_view",
                render: value => {
                  if (value) {
                    return (
                      <div className="status">
                        <Icon type="check" />
                      </div>
                    );
                  } else {
                    return (
                      <span className="status">
                        <Icon type="close" />
                      </span>
                    );
                  }
                },
                filters: [
                  { text: "能", value: "true" },
                  { text: "否", value: "false" }
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.is_active.toString() === value
              },
              {
                title: "超级用户",
                dataIndex: "is_superuser",
                key: "is_superuser",
                render: value => {
                  if (value) {
                    return (
                      <div className="status">
                        <Icon type="check" />
                      </div>
                    );
                  } else {
                    return (
                      <span className="status">
                        <Icon type="close" />
                      </span>
                    );
                  }
                },
                filters: [
                  { text: "超级用户", value: "true" },
                  { text: "普通用户", value: "false" }
                ],
                filterMultiple: false,
                onFilter: (value, record) => record.is_superuser.toString() === value
              },
              {
                title: "手机号",
                dataIndex: "mobile",
                key: "mobile",
                render: value => {
                  if (value) {
                    return <div className="center">{value}</div>;
                  } else {
                    return <div className="center">---</div>;
                  }
                }
              },
              {
                title: "加入时间",
                dataIndex: "date_joined",
                key: "date_joined",
                sorter: (a, b) => a.id - b.id
              },
              {
                title: "Action",
                key: "action",
                // 使用自定义的render，2种操作，编辑、删除
                render: (text, record) => {
                  // 根据是否显示删除，来显示按钮
                  if (showDelete) {
                    var message = (
                      <span>
                        <p>删除用户且禁止登陆！</p>
                        <p>{`您确认删除:${text.username}?`}</p>
                      </span>
                    );
        
                    var deleteButton;
                    if (text.is_active) {
                      deleteButton = (
                        <Popconfirm
                          title={message}
                          onCancel={deleteOnCancel}
                          onConfirm={() => deleteOnConfirm(text)}
                        >
                          <span type="link">
                            <Button type="link" size="small" danger>
                              <Icon type="trash-o"> 删除</Icon>
                            </Button>
                          </span>
                        </Popconfirm>
                      );
                    } else {
                      deleteButton = "已禁用";
                    }
        
                    return (
                      <span>
                        <span type="link" onClick={() => editorOnClick(text)}>
                          <Button type="link" size="small">
                              <Icon type="edit"> 编辑</Icon>
                          </Button>
                        </span>
                        <span className="ant-divider" />
                        {deleteButton}
                      </span>
                    );
                  } else {
                    // 如果不显示删除按钮
                    if (text.is_active) {
                      return (
                        <span>
                          <span type="link" onClick={() => editorOnClick(text)}>
                            <Button type="link" size="small">
                              <Icon type="edit"> 编辑</Icon>
                            </Button>
                          </span>
                        </span>
                      );
                    } else {
                      return (
                        <span>
                          <span type="link" onClick={() => editorOnClick(text)}>
                            <Button type="link" size="small">
                              <Icon type="edit"> 编辑</Icon>
                            </Button>
                          </span>
                          <Divider type="vertical" />
                          已禁用
                        </span>
                      );
                    }
                  }
                }
              }
        ]
    }, [deleteOnCancel, deleteOnConfirm, editorOnClick, showDelete]);

    let rightButtons = useMemo(() => {
        return (
            <span>
                <Button
                    type="dashed"
                    style={{width: 100}}
                    // icon={<i className="fa fa-user"/>}
                    icon={<Icon type="trash-o"/>}
                    danger
                    onClick={changeShowDelete}
                    >
                    { showDelete ? "隐藏删除" : "显示删除"}
                </Button>
                <Button
                    style={{width: 100}}
                    type="default"
                    // icon="reload"
                    icon={<Icon type="refresh"/>}
                    onClick={() => {setReFreshTimes(preState => preState + 1)}}
                >
                    刷新
                </Button>
            </span>
        );
        
    }, [changeShowDelete, showDelete]);

    useEffect(() => {
      // 因为user模块很多用的是class定义组件，不能使用useContext
      // 故在这里设置顶部的导航
      setNavData([
        {
          title: "首页",
          icon: "home",
          link: "/"
        },
        {
          title: "用户",
          link: "/user"
        },
        {
          title: "列表",
        }
      ])
    }, [setNavData]);

    return (
        <div className="content">
            <div className="main">
                <Row className="title">
                    <h4>用户列表</h4>
                </Row>

                <BaseTable
                    columns={columns}
                    filterColumns={filterColumns} // filter会用到
                    paramsFields={paramsFields}  // url传递的参数
                    location={props.location}
                    history={props.history}
                    apiUrlPrefix="/api/v1/account/user/list"
                    pageUrlPrefix="/user/list"
                    reFreshTimes={reFreshTimes} // 刷新数据
                    rightButtons={rightButtons} // 右侧的按钮
                />
            </div>

            {/* 编辑用户的对话框 */}
            <UserEditorModal
                visible={visible}
                afterHandler={resetCurretUserState}
                data={currentUser}
            />

        </div>
    );
}

export default UserListPage;
