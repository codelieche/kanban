/**
 * 用户列表页
 */

import React from "react";
import { Link } from "react-router-dom";

import {
  Button,
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
// 有些浏览器不兼容URLSearchParams，所以使用自定义的URLSearchParams
import URLSearchParams from "../Utils/UrlParam";

import UserEditorModal from "./EditorModal";

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    // 状态中dataSource是源数据【从服务器fetch过来的数据】

    // 处理url中传递的数据
    var searchParams = new URLSearchParams(this.props.location.search);
    var page = searchParams.get("page");
    // Page需要是整数
    if(isNaN(page)){
        page = 1;
    }else{
        page = parseInt(page, 10);
    }

    this.state = {
      // 当前页
      currentPage: page,
      loaded: false,
      dataSource: [],
      visible: false,
      currentUser: {},
      dataCount: 0,
      // 显示删除按钮
      showDelete: false,
      // 搜索关键词
      search: searchParams.get('search'),
      // 排序
      ordering: searchParams.get("ordering"),
      locationSearch: this.props.location.search,
      // 过滤字段
      is_active: searchParams.get("is_active"),
      can_view: searchParams.get("can_view"),
      is_superuser: searchParams.get("is_superuser"),
    };
  }

  componentDidMount() {
    this.fetchData(this.state.currentPage);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.location.search !== prevState.locationSearch){
      // 处理url中传递的数据
      var searchParams = new URLSearchParams(nextProps.location.search);
      var page = searchParams.get("page");
      // Page需要是整数
      if(isNaN(page)){
          page = 1;
      }else{
          page = parseInt(page, 10);
      }
      // 返回新的状态
      return {
        locationSearch: nextProps.location.search,
        currentPage: page,
        // 搜索关键词
        search: searchParams.get('search'),
        // 排序
        ordering: searchParams.get("ordering"),
        // 过滤字段
        is_active: searchParams.get("is_active"),
        can_view: searchParams.get("can_view"),
        is_superuser: searchParams.get("is_superuser"),
      }

    }else{
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState, snaptshot){
    // 如果状态变更了，就需要重新获取一下数据
    if(prevProps.location.search !== this.state.locationSearch){
        // console.log("需要加载新的数据了", this.state.currentPage, this.state.status);
        // 记得在search修改的时候，设置新的currentPage
        this.fetchData(this.state.currentPage);
    }
  }

  fetchData = (page) => {
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

    // 对page进行校验
    if(isNaN(page)){
      page = 1;
    }

    var url = "/api/v1/account/user/list?page=" + page;
    // 是否有search关键词
    if(this.state.search){
      url = `${url}&search=${this.state.search}`;
    }
    // 排序
    if(this.state.ordering){
      url = `${url}&ordering=${this.state.ordering}`;
    }

    // 过滤字段
    var filterColums = ['is_active', 'can_view', 'is_superuser'];
    filterColums.forEach(item => {
      // console.log(item, this.state[item])
      var v = this.state[item];
      if(v){
          url = `${url}&${item}=${v}`;
      }else{
          
      }
    });
    // console.log(url);

    // 跨域访问默认是不带cookie的，这个特别注意
    fetchApi.Get(url)
      .then(responseData => {
        // 返回的json数据是数组才去修改列表相关的数据
        let data = responseData.results;
        if (data instanceof Array) {
          this.setState({
            dataSource: data,
            loaded: true,
            dataCount: responseData.count,
            currentPage: page,
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
  }

  onSearchHandler = value => {
    // 搜索框回车后处理函数
    // console.log(value);
    this.setState({
      search: value,
      currentPage: 1,
    }, () => {
      let url = "/user/list?page=1";

      if(value){
        url = `${url}&search=${value}`;
      }

      // 过滤字段
      var filterColums = ['is_active', 'can_view', 'is_superuser'];
      filterColums.forEach(item => {
        // console.log(item, this.state[item])
        var v = this.state[item];
        if(v){
            url = `${url}&${item}=${v}`;
        }
      });

      // 排序
      if(this.state.ordering){
        if(url.indexOf("?") > 0){
            url = `${url}&ordering=${this.state.ordering}`;
        }else{
            url = `${url}?ordering=${this.state.ordering}`;
        }
      }
      // 跳转新的连接，重点是需要url中的params的数据
      this.props.history.push(url);
    });
  }

  editorOnClick = user => {
    this.setState({
      visible: true,
      currentUser: user
    });
  }

  deleteOnCancel = e => {
    // 选择取消的话，也弹出消息
    message.error("取消删除", 3);
  }

  deleteOnConfirm = value => {
    // 开始删除
    const url = `/api/v1/account/user/${value.id}`;
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

  handleTableChange = (pagination, filters, sorter) => {
    // console.log(pagination, filters, sorter);
    var currentPage = pagination.current;
    // 为了整合根据status的过滤和根据status_code的排序
    // 设置状态栏的key为：status_code,而dataIndex是字符status
    // 所以在取过滤字段要用status，而排序要用status_code【特别注意】
    var filterColums = ['is_active', 'can_view', 'is_superuser'];
    let values = {is_active: null, can_view: null, is_superuser: null};
    filterColums.forEach(item => {
      var v = filters[item];
      if(v){
          if(v instanceof Array){
              values[item] = v[0];
          }else{
              values[item] = v;
          }
      }else{
          values[item] = null;
      }
    });
    
    // console.log(values);

    // 构造新的连接
    let url = `/user/list?page=${currentPage}`;
    if(this.state.search){
      url = `${url}&search=${this.state.search}`;
    }

    // 过滤字段
    filterColums.forEach(item => {
      var v = values[item];

      if(v){
          url = `${url}&${item}=${v}`;
      }else{
          
      }
    });

    // 排序
    if(sorter && sorter.columnKey){
      if(sorter.order === "ascend"){
          // 升序排列
          url = `${url}&ordering=${sorter.columnKey}`;
      }else{
          // 降序排列
          url = `${url}&ordering=-${sorter.columnKey}`;
      }
    
    }

    // 跳转新的连接
    this.props.history.push(url);

  }

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
        {/* <Breadcrumb className="nav">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>用户</Breadcrumb.Item>
        </Breadcrumb> */}
        
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
              dataSource={this.state.dataSource}
              rowKey="id"
              bordered={true}
              pagination={{current: this.state.currentPage, total: this.state.dataCount}}
              onChange={this.handleTableChange}
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
