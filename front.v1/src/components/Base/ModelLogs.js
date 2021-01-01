/**
 * Model日志
 * 需要传递的属性：
 *  1. app：django中appname
 *  2. model：app.models中的Model名称
 *  3. id：对象的主键
 *  4. app和model都是小写
 *  5. showNoContent: 默认是false，没消息内容的时候显示内容
 *  6. title：标题，默认是：操作记录
 * 
 * 获取日志的api：/api/v1/modellog/${app}/${model}/${pk}/list
 *  1. 日志列表是带分页的
 */
import React from 'react';

import {
    Timeline,
} from 'antd';
import fetchApi from "../Utils/fetchApi";

const Item = Timeline.Item;

class LogItem extends React.Component {
    // 日志Item组件
    /**
     * 数据结构
     * user：用户：
     * action：操作：添加、修改、删除
     * action_flag: 操作标志：1、2、3
     * message：可能是对象，也可能是个字符串, 也可能是个数组
     */
    render() {
        var data = this.props.data, actionText, messageElement;
        // 获取action
        if(data.action_flag === 1){
            actionText = '添加';
            messageElement = "添加对象"
        }else if (data.action_flag === 2){
            actionText = '修改';
            var message = data.message;
            if(message instanceof Array){
                messageElement = message.map((item, index) => {
                    var valueOld = item.value_old instanceof Array ? item.value_old.join(',') : item.value_old;
                    var valueNew = item.value_new instanceof Array ? item.value_new.join(',') : (item.value_new ? item.value_new.toString() : "null");
                    return (
                        <div className="changed-message" key={index}>
                            <div className="content">
                                <div className="field">字段：{item.field}</div>
                                <div className="value-old">{valueOld}</div>
                                <div className="value-new">{valueNew}</div>
                            </div>
                        </div>
                    );
                });
            }else{
                messageElement = "修改对象";
            }
        }else if (data.action_flag === 3){
            actionText = '删除';
            messageElement = "删除对象";
        }else{
            return null;
        }
        return (
            <div className="modlelog-item">
                <div className="row info">
                    <span className="config">用户:</span>
                    <span className="value">{data.user}</span>
                </div>

                <div className="row info">
                    <span className="config">操作:</span>
                    <span className="value">{actionText}</span>
                </div>

                <div className="row info">
                    <span className="config">信息:</span>
                    <span className="value">{messageElement}</span>
                </div>

                <div className="row info">
                    <span className="config">时间:</span>
                   <span className="value time">{data.time_added}</span>
                </div>
            </div>
        );
    }
}

export default class ModelLogs extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: this.props.title ? this.props.title : '操作记录',
            showNoContent: this.props.showNoContent ? true : false,
            id: this.props.id,
            datasource: [],
            app: this.props.app,
            model: this.props.model,
            nextPage: 1,
            loading: false,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // 当接收到新的app / model的时候，需要变更下
        if(nextProps.id !== prevState.id){
            return {
                id: nextProps.id,
                datasource: [],
                app: nextProps.app,
                model: nextProps.model,
                nextPage: 1,
                loading: false,
            };
        }else{
            return null;
        }
    }

    componentDidMount() {
        // 获取Model的日志列表
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState, snaptshot){
        // 如果状态变更了，就需要重新获取一下数据
        if(
            prevProps.id !== this.state.id || 
            prevState.app !== this.state.app || 
            prevProps.model !== this.state.model
        ){
            // 需要获取下日志
            this.fetchData();
        }
      }
    
    fetchData = () => {
        // 获取Model的日志信息
        if(this.state.nextPage) {
            // 判断是否在加载
            if(this.state.loading){
                return ;
            }else{
                this.setState({loading: true});
            }
            const url = `/api/v1/modellog/${this.state.app}/${this.state.model}/${this.state.id}/list?page=${this.state.nextPage}`;
            // 获取数据
            fetchApi.Get(url)
                .then(data => {
                    // 但会的数据是有next，previous，results字段的
                    var results = data.results, nextPage, prePage = this.state.nextPage;
                    if(data.next){
                        // 因为nextPage是个url，如果存在，就表示有下一页
                        nextPage = this.state.nextPage + 1;
                    }else{
                        nextPage = null;
                    }
                    // 如果results是个数组
                    if(results instanceof Array){
                        var newLogs;
                        if(prePage === 1){
                            // 因为修改props会再次发起fetch数据请求
                            // 如果是获取第一页数据，新的日志列表直接是results
                            // 如果不是第1页数据，就需要连接下老的数据
                            newLogs = results;
                        }else{
                            newLogs = this.state.datasource.concat(results);
                        }

                        this.setState({
                            nextPage: nextPage,
                            datasource: newLogs,
                            loading: false
                        });
                    }else{
                        this.setState({
                            nextPage: nextPage,
                            loading: false
                        })
                    }
                })
                  .catch(err => {
                      console.log(err);
                      this.setState({loading: false});
                  })
        }else{
            console.log("已经没有更多日志信息");
        }
    }

    render() {
        var logItems, moreButton;
        if(this.state.datasource){
            logItems = this.state.datasource.map((item, index) => {
                if(item.action_flag === 3){
                    // 1. 增加；2. 修改；3. 删除
                    return (
                        <Item key={index} color="red">
                            <LogItem data={item} />
                        </Item>
                    )
                }else{
                    return (
                        <Item key={index}>
                            <LogItem data={item} />
                        </Item>
                    );
                }
            })
        }

        // 渲染查看更多按钮
        if(this.state.nextPage){
            moreButton = (
                <div className="more" onClick={() => this.fetchData()}>
                    点击加载更多
                </div>
            );
        }

        // 有日志就显示日志，无日志就提示无日志信息
        if(this.state.datasource.length > 0){
            return (
                <div> 
                    <div className="title" >
                        <h4>{this.state.title}</h4>
                    </div>
                    <div className='modellogs'>
                        <Timeline>
                            {logItems}
                        </Timeline>
                        {moreButton}
                    </div>
                </div>
            );
        }else if(this.state.showNoContent){
            return (
                <div> 
                    <div className="title" >
                        <h4>{this.state.title}</h4>
                    </div>
                    <div className="no-content border">无{this.state.title}</div>
                </div>
            );
        }else{
            return null;
        }
    }
}
