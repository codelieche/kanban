/**
 * 用户分组 List
 */
import React, {useState, useCallback, useMemo, useContext, useEffect} from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Popconfirm,
  message
} from "antd";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";
import BaseTable from "../../Page/BaseTable";
import GlobalContext from "../../Base/Context";

export const UserGroupList = (props) => {
  // 状态: 控制刷新数据
  const [ reFreshTimes, setReFreshTimes ] = useState(0);

  // 全局导航
  const { setNavData } = useContext(GlobalContext);

  useEffect(() => {
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
        title: "分组",
        link: "/user/group/list"
      },
      {
        title: "列表",
      }
    ])
  }, [setNavData])
  
  const deleteOnConfirm = useCallback(value => {
    // console.log(value);
    // 开始删除
    const url = "/api/v1/account/group/" + value.id;
    fetchApi.Delete(url)
      .then(response => {
        // 查看status状态码,ok(true/false)
        if (response.status === 204) {
          message.success("删除:" + value.name + "成功", 3);
          this.fetchData(this.state.currentPage);
        } else {
          try {
            return response.json();
          } catch (error) {
            message.error("删除:" + value.name + "失败", 3);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const deleteOnCancel = useCallback(e => {
    // 选择取消的话，也弹出消息
    message.error("取消删除", 3);
  }, []);

  // paramsFields字段：通过url可获取到的字段信息
  const paramsFields = useMemo(() => {
      return ["page", "search", "ordering", "is_active"]
  }, [])

  // 表格的filter字段
  const filterColumns = useMemo(() => {
      return ["is_active",]
  }, [])

  // Table的列：Name、Parent、Type、Description、Action
  const columns = useMemo(() => {
    return [
              {
                title: "ID",
                dataIndex: "id",
                key: "id",
                render: (text, record) => {
                  return (
                    <Link
                      to={{
                        pathname: "/user/group/" + record.id,
                        state: { data: record }
                      }}
                    >
                      {text}
                    </Link>
                  );
                },
                sorter: (a, b) => a.id - b.id
              },
              {
                title: "分组名",
                dataIndex: "name",
                key: "name"
              },
              {
                title: "用户",
                dataIndex: "user_set",
                key: "user_set",
                render: values => {
                  return values.join(", ");
                }
              },
              {
                title: "操作",
                key: "action",
                // 使用自定义的render：三种操作按钮（Detail、Edior、Delete）
                render: (text, record) => {
                  // console.log(text, record);
                  return (
                    <span>
                      {/* Link传递数据，可以使用state，然后通过this.props.location.state来获取相应的数据 */}
                      <Link
                        to={{
                          pathname: "/user/group/" + text.id,
                          state: { data: text }
                        }}
                      >
                        <Icon type="link"> 详情</Icon>
                      </Link>
                      <span className="ant-divider" />
                      <Link
                        to={{
                          pathname: "/user/group/" + text.id + "/editor",
                          state: { data: text }
                        }}
                      >
                        <Icon type="edit"> 编辑</Icon>
                      </Link>
                      <span className="ant-divider" />
                      <Popconfirm
                        title={"您确认删除:" + text.name + "?"}
                        onCancel={deleteOnCancel}
                        onConfirm={() => deleteOnConfirm(text)}
                      >
                          <span>
                            <Icon type="trash-o" danger={true}> 删除</Icon>
                          </span>
                      </Popconfirm>
                    </span>
                  );
                }
              }
            ];
  }, [deleteOnCancel, deleteOnConfirm])

  // 右侧的按钮
  const rightButtons = useMemo(() => {
    return (
      <span>
        <Button
          type="default"
          icon={<Icon type="refresh"/>}
          onClick={() => setReFreshTimes(preState => preState + 1)}
        >
          刷新
        </Button>
        <Link to="/user/group/add">
          <Button type="primary" icon={<Icon type="plus"></Icon>}>
            Add
          </Button>
        </Link>
      </span>
    )
  }, [])

  return (
    <div className="content">
      <div className="main">
        <div className="title">
          <h4>分组列表</h4>
        </div>

        <BaseTable
            columns={columns}
            filterColumns={filterColumns} // filter会用到
            paramsFields={paramsFields}  // url传递的参数
            location={props.location}
            history={props.history}
            apiUrlPrefix="/api/v1/account/group/list"
            pageUrlPrefix="/user/group/list"
            reFreshTimes={reFreshTimes} // 刷新数据
            rightButtons={rightButtons} // 右侧的按钮
        />
      </div>
    </div>
  );
}

export default UserGroupList;
