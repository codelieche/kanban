/**
 * 用户消息 Detail Page
 * 路由设置：<Route exat path='/user/message/:id(\d+)' component={MessageDetail} />
 * 通过this.props.match.params.id就可以获取到message的id
 */
import React, {useState, useCallback, useMemo, useEffect, useContext} from "react";

import { Link } from "react-router-dom";

import fetchApi from "../../Utils/fetchApi";
import { GlobalContext } from "../../Base/Context";
import LoadingPage from "../../Page/Loading";

export const MessageDetail = (props) => {

  // 状态
  const [id, setID] = useState(null);
  const [detail, setDetail] = useState({});
  const [loaded, setLoaded] = useState(false);

  // 导航数据
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
        title: "消息",
        link: "/user/message/list"
      },
      {
        title: "详情",
      }
    ])
  }, [setNavData])


  const fetchDetailData = useCallback((messageID) => {
    //获取详情信息
    // get信息虽然是安全的，但是后台api大部分设置了需要登陆才可以访问
    const url = "/api/v1/account/message/" + messageID;
    fetchApi.Get(url)
      .then(responseData => {
        setDetail(responseData);
        setLoaded(true);
      })
      .catch(err => {
        console.log(err);
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if(props.match.params.id !== id){
      setID(props.match.params.id);
      fetchDetailData(props.match.params.id);
    }
  }, [props.match, fetchDetailData, id])
  
  const linkElement = useMemo(() => {
    if (detail.link) {
      return (
        <Link to={detail.link}>
          {detail.link}
        </Link>
      );
    }else{
      return null;
    }
  }, [detail]);

  if(!loaded){
    return (
      <LoadingPage />
    )
  }
    
  return (
    <div className="content">
      <div className="main">
        <div className="message">
          <div className="header">
            <div className="title">
              <h2>{detail.title}</h2>
            </div>
            <div className="meta">
              <span>消息类型: {detail.scope}</span>
              <span>发送者: {detail.sender}</span>
              <span>时间: {detail.time_added}</span>
            </div>
          </div>

          <div className="body">
            {detail.content}
            <br />
            {linkElement}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageDetail;
