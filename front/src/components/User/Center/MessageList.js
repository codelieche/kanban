/**
 * 用户中心右侧消息列表
 * 先获取最新的十条消息
 */
import React, {useState, useCallback, useMemo, useEffect, useContext} from "react";

import { Link } from "react-router-dom";

import { GlobalContext } from "../../Base/Context";
import fetchApi from "../../Utils/fetchApi";

import MessageItem from "./MessageItem";

export const MessageList = (props) => {
  // 状态
  const [ more , setMore] = useState(false)
  const [dataSource, setDataSource] = useState([]);
  // 全局上下文
  const { history } = useContext(GlobalContext);

  // 获取消息列表
  const fetchMessageData = useCallback(() => {
    // 从api获取最新的十条消息
    var url = "/api/v1/account/message/list";
    fetchApi.Get(url)
      .then(responseData => {
        // 把results保存到state中
        var data = responseData.results;
        if (data instanceof Array) {
          // 获取到的数据需要是个数组
          var more = responseData.next ? true : false;
          setMore(more);
          setDataSource(data);
        }
      });
  }, []);

  useEffect(() => {
    if(dataSource.length === 0){
      fetchMessageData();
    }
  }, [fetchMessageData, dataSource.length])

  // 先渲染messageItem
  var messageItems, messageListInner;
  messageItems = dataSource.map((item, index) => {
    return (
      <MessageItem data={item} key={index} history={history} />
    );
  });

  let moreMessage = useMemo(() => {
    if(more){
      return (
        <div className="more">
          <Link className="" to="/user/message/all">
            查看更多
          </Link>
        </div>
      );
    }else{
      return null;
    }
    
  }, [more])

  if (messageItems.length > 0) {
    messageListInner = (
      <div className="inner">
        <ul className="list">{messageItems}</ul>
        {moreMessage}
      </div>
    );
  } else {
    messageListInner = <div className="no-content">暂无消息</div>;
  }

  return (
    <div className="panel">
      <div className="header">消息列表</div>
      {messageListInner}
    </div>
  );
}

export default MessageList;