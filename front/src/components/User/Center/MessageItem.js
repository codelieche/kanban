/**
 * 消息中心消息Item
 * 需要一层一层的，把history传递过来，使用react-router-dom的Link会报错
 * 所以在User/Center/Index中，把history传给MessageList再传给MessageItem
 */
import React, {useState, useCallback, useEffect} from 'react';
import {
    Badge
} from "antd";
import {notification} from 'antd';
import fetchApi from '../../Utils/fetchApi';

export const MessageItem = (props) => {
    // 状态
    const [ data, setData] = useState({});

    useEffect(() => {
        if(props.data !== data && !data.id){
            setData(props.data);
        }
    }, [data, props.data])
    
    const fetchDetailData = useCallback((id) => {
        if(!id){
            return;
        }
        //获取详情信息
        // get信息虽然是安全的，但是后台api大部分设置了需要登陆才可以访问
        const url = '/api/v1/account/message/' + id;
        fetchApi.Get(url)
            .then(responseData => {
                // 不做处理，只是触发读取消息而已
                // setDetail(responseData);
            })
              .catch(err => {
                  console.log(err);
              })
    }, [])

    const renderDescription = useCallback(() => {
        // 根据传递过来的数据，渲染description
        const message = data;
        var linkElement;
        if(message.link){
            // linkElement = <a href={message.link} onClick={() => this.props.history.push(message.link)}>查看详情</a>
            linkElement = <a href={message.link}>查看详情</a>
        }

        return (
            <div className="message">
                <div className="meta">
                    <span className="meta-item">消息类型:{message.scope}</span>
                    <span className="meta-item">发送时间:{message.time_added}</span>
                </div>
                <div className="content">
                    {message.content}
                    {linkElement}
                </div>
            </div>
        );

    }, [data])

    const openNotification = useCallback(() => {
        // 如果这条消息的状态是未读，那么我们就get访问下这条消息
        if(data.unread){
            fetchDetailData(data.id);
            setData(prevState => {
                prevState.unread = false;
                return prevState;
            });
        }

        const args = {
            message: data.title,
            description: renderDescription(),
            duration: 4,
        };

        notification.open(args);
    }, [data.id, data.title, data.unread, fetchDetailData, renderDescription])

    // 是否未读
    let unread;
    if(data.unread){
        unread = (
            <Badge status="default" color="cyan" />
        );
    }else{
        unread = (
            // <Badge status="default" style={{visibility: "hidden"}} />
            <Badge status="default" color="#dfdfdf" />
        );
    }

    return (
        <div className="item" onClick={openNotification}>
            {unread}{data.title}
        </div>
    );
}

export default MessageItem;