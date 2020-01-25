/**
 * 用户列表页
 */

import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

import {
  Button,
  Breadcrumb,
  Input,
  Popconfirm,
  Row,
  Col,
  Table,
  message,
  Divider
} from "antd";

import Icon from "../Base/Icon";
import fetchApi from "../Utils/fetchApi";

import UserEditorModal from "./EditorModal";

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    // 状态中dataSource是源数据【从服务器fetch过来的数据】

    this.state = {
      loaded: false,
      dataSource: [],
      dataFilter: [],
      visible: false,
      currentUser: {},
      // 显示删除按钮
      showDelete: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    // 因为有个刷新按钮，防止连续点击
    // 当fetch完数据后设置loaded状态为true
    if (this.state.loaded) {
      this.setState({
        loaded: false
      });
    } else {
      //正在加载，如果dataSource不是空直接返回
      // 这个时候是因为点了刷新数据，但是上次刷新的请求正在进行中，有数据就直接返回吧
      if (this.state.dataSource.length > 0) {
        return;
      }
    }
    var url = "http://127.0.0.1:9000/api/v1/account/user/all";
    // 跨域访问默认是不带cookie的，这个特别注意
    fetchApi.Get(url)
      .then(responseData => {
        // 返回的json数据是数组才去修改列表相关的数据
        if (responseData instanceof Array) {
          this.setState({
            dataSource: responseData,
            dataFilter: responseData,
            loaded: true
          });
        } else {
          this.setState({
            loaded: true
          });
          message.error(JSON.stringify(responseData), 5);
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loaded: true
        });
      });
  };

  onSearchHandler = value => {
    // 搜索框回车后处理函数
    // 主要就是使用lodash的filter从源数据是dataSource中过滤出dataFilter
    if (value) {
      var newData = [];
      var search = value.toLowerCase();
      newData = _.filter(this.state.dataSource, function(item) {
        if (item.username.toLowerCase().indexOf(search) >= 0) {
          return true;
        } else {
          return false;
        }
      });
      this.setState({
        dataFilter: newData
      });
    } else {
      // value是空了，表示不搜索了，那么就显示出全部数据
      this.setState(prevState => ({
        dataFilter: prevState.dataSource
      }));
    }
  };

  editorOnClick = user => {
    this.setState({
      visible: true,
      currentUser: user
    });
  };

  deleteOnCancel = e => {
    // 选择取消的话，也弹出消息
    message.error("取消删除", 3);
  };

  deleteOnConfirm = value => {
    // 开始删除
    const url = `http://127.0.0.1:9000/api/v1/account/user/${value.id}`;
    // 通过delete删除用户
    fetchApi.Delete(url)
      .then(response => {
        //   查看status状态码
        if (response.status === 204) {
          message.success("删除" + value.username + "成功！", 3);
          // 刷新数据
          this.fetchData();
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
  };

  resetCurretUserState = reFresh => {
    // 重新设置user和visible
    this.setState(
      {
        visible: false,
        currentUser: {}
      },
      () => {
        if (reFresh !== false) {
          this.fetchData();
        }
      }
    );
  };

  changeShowDelete = () => {
    // 改变showDelete的值
    this.setState(prevState => {
      return { showDelete: !prevState.showDelete };
    });
  };

  render() {
    // Table的列：id, username
    const columns = [
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
        title: "Action",
        key: "action",
        // 使用自定义的render，2种操作，编辑、删除
        render: (text, record) => {
          // 根据是否显示删除，来显示按钮
          if (this.state.showDelete) {
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
                  onCancel={this.deleteOnCancel}
                  onConfirm={() => this.deleteOnConfirm(text)}
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
                <span type="link" onClick={() => this.editorOnClick(text)}>
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
                  <span type="link" onClick={() => this.editorOnClick(text)}>
                    <Button type="link" size="small">
                      <Icon type="edit"> 编辑</Icon>
                    </Button>
                  </span>
                </span>
              );
            } else {
              return (
                <span>
                  <span type="link" onClick={() => this.editorOnClick(text)}>
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
    ];

    return (
      <div className="content">
        {/* 面包屑开始 */}
        <Breadcrumb className="nav">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>用户</Breadcrumb.Item>
        </Breadcrumb>
        {/*面包屑 end  */}
        <div className="main">
          <div className="title">
            <h4>用户列表</h4>
          </div>
          {/*工具栏开始：搜索 刷新 添加  */}
          <Row className="tools">
            <Col span={12}>
              <Input.Search
                placeholder="search user"
                style={{ width: 200 }}
                onSearch={this.onSearchHandler}
              />
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="dashed"
                style={{width: 100}}
                // icon={<i className="fa fa-user"/>}
                icon={<Icon type="trash-o"/>}
                danger
                onClick={this.changeShowDelete}
              >
                {this.state.showDelete ? "隐藏删除" : "显示删除"}
              </Button>
              <Button
                style={{width: 100}}
                type="default"
                // icon="reload"
                icon={<Icon type="refresh"/>}
                loading={!this.state.loaded}
                onClick={this.fetchData}
              >
                刷新
              </Button>
            </Col>
          </Row>
          {/*工具栏 end  */}
          <div className="main-list">
            <Table
              columns={columns}
              dataSource={this.state.dataFilter}
              rowKey="id"
              bordered={true}
            />
          </div>
          {/* 编辑用户的对话框 */}
          <UserEditorModal
            visible={this.state.visible}
            afterHandler={this.resetCurretUserState}
            data={this.state.currentUser}
          />
        </div>
      </div>
    );
  }
}
