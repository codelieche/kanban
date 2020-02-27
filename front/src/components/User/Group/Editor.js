/**
 * 用户组编辑页
 */
import React from "react";
import { message } from "antd";

import fetchApi from "../../Utils/fetchApi";
import UserGroupForm from "./Form";

export default class UserGroupEditor extends React.Component {
  constructor(props) {
    super(props);
    // 获取Group的id
    var id = this.props.match.params.id;
    this.state = {
      id: id,
      data: {},
      loaded: false
    };
  }

  componentDidMount() {
    // 获取Group的数据
    this.fetchData();
  }

  fetchData = () => {
    // 获取group的编辑数据
    const url =
      "/api/v1/account/group/" + this.state.id + "/editor";
    fetchApi.Get(url)
      .then(data => {
        this.setState({
          data: data,
          loaded: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleEditorSubmit = values => {
    // 提交编辑表单处理函数
    // console.log(values);
    // 通过fetch PUT 编辑Group
    const url = "/api/v1/account/group/" + this.state.id;
    fetchApi.Put(url, {}, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      data: values
    })
      .then(data => {
        if (data.id > 0) {
          this.props.history.push("/user/group/" + data.id);
        } else {
          message.error(JSON.stringify(data), 8);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="content">
        {/* <Breadcrumb className="nav">
          <Breadcrumb.Item>
            <Link to="/">首页</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/user/group">用户组</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb> */}
        
        <div className="main">
          <div className="title">
            <h4>编辑用户组</h4>
          </div>
          <div className="wrap">
            <UserGroupForm
              handleSubmit={this.handleEditorSubmit}
              data={this.state.data}
              type="editor"
            />
          </div>
        </div>
      </div>
    );
  }
}
