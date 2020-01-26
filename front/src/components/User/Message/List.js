import React from "react";
import { Link } from "react-router-dom";

import {
  Badge,
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

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    // 状态中dataSource是源数据【从服务器fetch过来的数组】
    // dataFilter是根据search输入框的变化而变化的【过滤查询后的数组】
    // 在删除操作中，删除了元素后，要修改dataSource和dataFilter的值【细节】
    var type = this.props.match.params.type;
    this.state = {
      loaded: false,
      dataSource: [],
      type: type,
      // 工作流总共的条数，列表下面的分页会用到这个值
      dataCount: 0,
      // 当前列表页页码
      currentPage: 1,
      // 搜索关键词
      search: "",
      match: this.props.match,
    };
  }

  fetchData = page => {
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

    if (isNaN(page)) {
      page = 1;
    }
    var url;
    if (page) {
      if (this.state.search) {
        url = `/api/v1/account/message/list?type=${
          this.state.type
        }&page=${page}&search=${this.state.search}`;
      } else {
        url = `/api/v1/account/message/list?type=${
          this.state.type
        }&page=${page}`;
      }
    }

    // 跨域访问默认是不带cookie的，这个特别注意
    fetchApi.Get(url)
      .then(responseData => {
        // 返回的json数据是数组才去修改列表相关的数据
        var data = responseData.results;
        if (data instanceof Array) {
          this.setState(
            {
              dataSource: data,
              loaded: true,
              dataCount: responseData.count,
              currentPage: page
            },
            function() {
              if (this.state.type === "unread") {
                // 需要修改未读消息的条数
                this.props.updateUnReadCount(responseData.count);
              }
            }
          );
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
    this.fetchData();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // 当props被修改的时候，需要触发修改type状态和，重新获取消息数据
    // console.log(nextProps, prevState);
    if (nextProps.match !== prevState.match) {
      // 设置新的type
      var type = nextProps.match.params.type;
      // 修改完state后，再获取新的列表数据
      
      return {
          type: type
      }
    }else{
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState, snaptshot){
    // console.log(nextProps)
    if(prevProps.match.params.type !== this.state.type){
        this.fetchData();
    }
  } 

  deleteOnConfirm = value => {
    // console.log(value);
    // 开始删除
    const url = "/api/v1/account/message/" + value.id;
    fetchApi.Delete(url)
      .then(response => {
        // 查看status状态码,ok(true/false)
        if (response.status === 204) {
          message.success("删除:" + value.name + "成功", 3);
          // 删除后刷新数据
          this.fetchData(this.state.currentPage);
        } else {
          message.error("删除:" + value.name + "失败", 3);
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
    this.setState(
      {
        search: value
      },
      this.fetchData
    );
  };

  render() {
    // Table的列：Name、Parent、Type、Description、Action
    const columns = [
      {
        title: "标题",
        dataIndex: "title",
        key: "title",
        render: (text, record) => {
          return (
            <Link
              to={{
                pathname: "/user/message/" + record.id,
                state: { data: record }
              }}
            >
              {record.unread ? <Badge status="default" color="cyan" /> : null}
              {text}
            </Link>
          );
        }
      },
      {
        title: "时间",
        dataIndex: "time_added",
        key: "time_added",
        sorter: (a, b) =>
          Date.parse(new Date(a.time_added)) -
          Date.parse(new Date(b.time_added))
      },
      {
        title: "消息分类",
        dataIndex: "scope",
        key: "scope"
      },
      {
        title: "已读",
        dataIndex: "unread",
        key: "unread",
        // 使用自定义的rennder
        render: value => {
          if (value) {
            return (
              <span className="status">
                <Icon type="close" />
              </span>
            );
          } else {
            return (
              <div className="status">
                <Icon type="check" />
              </div>
            );
          }
        }
      },
      {
        title: "Action",
        key: "action",
        // 使用自定义的render：三种操作按钮（Detail、Edior、Delete）
        render: (text, record) => {
          // console.log(text, record);
          return (
            <span>
              {/* Link传递数据，可以使用state，然后通过this.props.location.state来获取相应的数据 */}
              <Link
                to={{
                  pathname: "/user/message/" + text.id,
                  state: { data: text }
                }}
              >
                <Icon type="link"> 详情</Icon>
              </Link>
              <span className="ant-divider" />
              <Popconfirm
                title={"您确认删除:" + text.id + "?"}
                onCancel={this.deleteOnCancel}
                onConfirm={() => this.deleteOnConfirm(text)}
              >
                <span>
                  <Icon type="trash-o" danger>删除</Icon>
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
          <Breadcrumb.Item>消息中心</Breadcrumb.Item>
        </Breadcrumb>
        {/*面包屑 end  */}
        <div className="main">
          <div className="title">
            <h4>消息列表</h4>
          </div>
          {/*工具栏开始：搜索 刷新 添加  */}
          <Row className="tools">
            <Col span={12}>
              <Input.Search
                placeholder="search message"
                style={{ width: 200 }}
                onSearch={this.onSearchHandler}
              />
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="default"
                icon={<Icon type="refresh"></Icon>}
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
              pagination={{
                current: this.state.currentPage,
                total: this.state.dataCount,
                onChange: this.fetchData
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
