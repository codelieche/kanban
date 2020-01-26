/**
 * 用户分组 List
 */
import React from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Breadcrumb,
  // Icon,
  Input,
  Popconfirm,
  Row,
  Col,
  Table,
  message
} from "antd";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";
// 有些浏览器不兼容URLSearchParams，所以使用自定义的URLSearchParams
import URLSearchParams from "../../Utils/UrlParam";

export default class UserGroupList extends React.Component {
  constructor(props) {
    super(props);
    // 处理url中传递的数据
    var searchParams = new URLSearchParams(this.props.location.search);
    var page = searchParams.get("page");
    // Page需要是整数
    if(isNaN(page)){
        page = 1;
    }else{
        page = parseInt(page, 10);
    }

    // 状态中dataSource是源数据【从服务器fetch过来的数组】
    // dataFilter是根据search输入框的变化而变化的【过滤查询后的数组】
    this.state = {
      loaded: false,
      dataSource: [],
      // 搜索关键词
      search: searchParams.get('search'),
      // 排序
      ordering: searchParams.get("ordering"),
      locationSearch: this.props.location.search,
      currentPage: page,
    };
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
      }
    }else{
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState, snaptshot){
    
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

    var url = "/api/v1/account/group/list?page=" + page;
    // 是否有search关键词
    if(this.state.search){
      url = `${url}&search=${this.state.search}`;
    }
    // 排序
    if(this.state.ordering){
      url = `${url}&ordering=${this.state.ordering}`;
    }

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
  };

  componentDidMount() {
    this.fetchData(this.state.currentPage);
  }

  deleteOnConfirm = value => {
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
  };

  deleteOnCancel = e => {
    // 选择取消的话，也弹出消息
    message.error("取消删除", 3);
  };

  onSearchHandler = value => {
    // 搜索框回车后处理函数
    console.log(value);
    this.setState({
      search: value,
      currentPage: 1,
    }, () => {
      let url = "/user/group/list?page=1";

      if(value){
        url = `${url}&search=${value}`;
      }

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

  handleTableChange = (pagination, filters, sorter) => {
    // console.log(pagination, filters, sorter);
    var currentPage = pagination.current;
    // 为了整合根据status的过滤和根据status_code的排序
    // 设置状态栏的key为：status_code,而dataIndex是字符status
    // 所以在取过滤字段要用status，而排序要用status_code【特别注意】

    // 构造新的连接
    let url = `/user/group/list?page=${currentPage}`;
    if(this.state.search){
      url = `${url}&search=${this.state.search}`;
    }
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
    // Table的列：Name、Parent、Type、Description、Action
    const columns = [
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
                onCancel={this.deleteOnCancel}
                onConfirm={() => this.deleteOnConfirm(text)}
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

    return (
      <div className="content">
        {/*面包屑开始  */}
        <Breadcrumb className="nav">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>用户组</Breadcrumb.Item>
        </Breadcrumb>
        {/*面包屑 end  */}
        <div className="main">
          <div className="title">
            <h4>分组列表</h4>
          </div>
          {/*工具栏开始：搜索 刷新 添加  */}
          <Row className="tools">
            <Col span={12}>
              <Input.Search
                placeholder="search group"
                style={{ width: 200 }}
                onSearch={this.onSearchHandler}
              />
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="default"
                icon={<Icon type="refresh" spin={!this.state.loaded}/>}
                onClick={this.fetchData}
              >
                刷新
              </Button>
              <Link to="/user/group/add">
                <Button type="primary" icon={<Icon type="plus"></Icon>}>
                  Add
                </Button>
              </Link>
            </Col>
          </Row>
          {/*工具栏 end  */}

          <Table
            columns={columns}
            dataCount={this.state.dataCount}
            dataSource={this.state.dataSource}
            rowKey="id"
            bordered={true}
            pagination={{current: this.state.currentPage, total: this.state.dataCount}}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}
