import React, { useState, useCallback, useEffect, useMemo} from "react";
import { Link } from "react-router-dom";

import {
  Badge,
  Popconfirm,
  message
} from "antd";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";
import BaseTable from "../../Page/BaseTable";


export const MessageList = (props) => {

  // 状态
  const [type, setType] = useState(null);
  const [ reFreshTimes, setReFreshTimes ] = useState(0);

  useEffect(() => {
    if(props.match.params.type !== type){
      setType(props.match.params.type);
      // 如果type存在，就表示不是第一次进入消息列表也，执行一下刷新吧
      if(type){
        setReFreshTimes(prevState => prevState + 1);
      }
    }
  }, [props.match.params.type, type])


  const deleteOnConfirm = useCallback(value => {
    // console.log(value);
    // 开始删除
    const url = "/api/v1/account/message/" + value.id;
    fetchApi.Delete(url)
      .then(response => {
        // 查看status状态码,ok(true/false)
        if (response.status === 204) {
          message.success("删除消息(ID:" + value.id + ")成功", 3);
          // 删除后刷新数据
          // this.fetchData(this.state.currentPage);
          setReFreshTimes(prevState => prevState + 1);
        } else {
          message.error("删除消息(ID:" + value.id + ")失败", 3);
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
    return ["page", "search", "ordering", "scope"]
  }, [])

  // 表格的filter字段
  const filterColumns = useMemo(() => {
      return ["unread", "scope", "user"]
  }, [])

  // Table的列：Name、Parent、Type、Description、Action
  const columns = useMemo(() => [
      {
        titel: "ID",
        dataIndex: "id",
        key: "id",
        sorter: () => {},
      },
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
              style={{textAlign:"left"}}
            >
              {record.unread ? <Badge status="default" color="cyan" /> : <Badge status="default" style={{visibility: "hidden"}} />}
              {text}
            </Link>
          );
        }
      },
      {
        title: "时间",
        dataIndex: "time_added",
        key: "time_added",
        // sorter: (a, b) =>
        //   Date.parse(new Date(a.time_added)) -
        //   Date.parse(new Date(b.time_added))
        sorter: () => {},
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
                onCancel={deleteOnCancel}
                onConfirm={() => deleteOnConfirm(text)}
              >
                <span>
                  <Icon type="trash-o" danger> 删除</Icon>
                </span>

              </Popconfirm>
            </span>
          );
        }
      }
  ], [deleteOnCancel, deleteOnConfirm]);

  const apiUrlPrefix = useMemo(() => {
    if(props.match.params.type === "all"){
      return "/api/v1/account/message/list";
    }else if(props.match.params.type === "unread"){
      return "/api/v1/account/message/list?unread=true";
    }else{
      return "/api/v1/account/message/list?unread=0";
    }
  }, [props.match.params.type])

  return (
    <div className="content">
      <div className="main">
        <div className="title">
          <h4>消息列表</h4>
        </div>
        <BaseTable
            columns={columns}
            filterColumns={filterColumns} // filter会用到
            paramsFields={paramsFields}  // url传递的参数
            location={props.location}
            history={props.history}
            apiUrlPrefix={apiUrlPrefix}
            pageUrlPrefix={`/user/message/${type}`}
            reFreshTimes={reFreshTimes} // 刷新数据
            // rightButtons={rightButtons} // 右侧的按钮
        />
      </div>
    </div>
  );
}

export default MessageList;
