/**
 * 消息中心消息Item
 * 需要一层一层的，把history传递过来，使用react-router-dom的Link会报错
 * 所以在User/Center/Index中，把history传给MessageList再传给MessageItem
 */
import React from 'react';
// import {
//     Link,
// } from 'react-router-dom';
import {
    Badge
} from "antd";
import {notification} from 'antd';
import fetchApi from '../../Utils/fetchApi';

export default class MessageItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: this.props.message,
        }
    }

    openNotification = () => {
        // 如果这条消息的状态是未读，那么我们就get访问下这条消息
        if(this.state.data.unread){
            this.fetchDetailData(this.state.data.id);
            this.setState(prevState => {
                let data = prevState.data;
                data.unread = false;
                return data;
            });
        }
        const args = {
            message: this.state.data.title,
            description: this.renderDescription(),
            duration: 4,
        };
        notification.open(args);
    }

    renderDescription = () => {
        // 根据传递过来的数据，渲染description
        const message = this.state.data;
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

    }

    fetchDetailData = (id) => {
        if(!id){
            return;
        }
        //获取详情信息
        // get信息虽然是安全的，但是后台api大部分设置了需要登陆才可以访问
        const url = '/api/v1/account/message/' + id;
        fetchApi.Get(url)
            .then(data => {
                this.setState({
                    detail: data,
                });
            })
              .catch(err => {
                  console.log(err);
              })
    }

    render() {
        // 是否未读
        let unread;
        if(this.state.data.unread){
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
            <div className="item" onClick={this.openNotification}>
                {unread}{this.state.data.title}
            </div>
        );
    }
}