/**
 * 文章的讨论列表
 */
import React, { useState, useCallback, useEffect, useMemo} from "react";

import {
    Comment, Avatar, Input, Radio, Button, message
} from "antd";
import moment from "moment";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";


const DiscussionItem = ({data, children, afterFetchPostHandle}) => {
    // 输入框内容
    const [ content, setContent ] = useState(null);

    // 输入框内容变更
    const handleInputChange = useCallback(e => {
        e.stopPropagation();
        setContent(e.target.value);
    }, []);

    // 发起讨论
    const fetchCreateDiscussion = useCallback((category, content, parent) => {
        if(!content){
            return;
        }
        let url = "/api/v1/docs/discussion/create";
        let data = {
            category: "comment",
            content,
            parent
        }
        // 发起post请求
        fetchApi.Post(url, {}, {
            data
        })
          .then(responseData => {
            //   console.log(responseData);
              if(responseData.id > 0){
                  message.success("添加评论成功", 3);
                  setContent(null);
                  if(afterFetchPostHandle){
                    afterFetchPostHandle();
                  }
              }else{
                  message.warn("评论失败：" + JSON.stringify(responseData), 5);
              }
              
          })
            .catch(err => {
                console.log(err);
                message.error("评论失败", 5);
            })
    }, [afterFetchPostHandle])
    
    return (
        <Comment
          author={data.user}
          avatar={
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<Icon type="user" noMarginRight={true} />} alt={data.user} />
          }
          content={data.content}
          datetime={moment(data.time_added, "YYYY-MM-DD HH:mm:ss").fromNow()}
          >
              <div className="comment">
                    <Input.Search 
                       value={content}
                       onChange={handleInputChange}
                       onSearch={(value) => fetchCreateDiscussion("comment", content, data.id)}
                       placeholder="评论" 
                       enterButton={<Button type="primary">评论</Button>}
                    />
              </div>
              {children}
          </Comment>
    );
}

export const ArticleDiscussionsList = ({id}) => {
    // 文章id
    // const [articleID, setArticleID] = useState(null);
    // 评论的列表页
    const [nextPage, setNextPage] = useState(0);
    // 获取到的评论数据
    const [dataSource, setDataSource ] = useState([]);
    // 评论分类
    const [category, setCategory] = useState("comment");
    // 评论内容
    const [content, setContent] = useState(null);

    // 获取文章的评论
    const fetchData = useCallback((articleID, page) => {
        // 判断是否有下一页
        if(page < 1 || !articleID){
            return;
        }
        // 开始获取评论数据
        let url = `/api/v1/docs/article/${articleID}/discussions?page=${page}`;
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              let data = responseData.results;
              // 修改dataSource
              // 如果当前页是第一页，那么直接设置dataSource，如果不是第一页就衔接dataSource
              if(page === 1){
                  setDataSource(data);
              }else{
                  setDataSource(prevState => [...prevState, ...data]);
              }
              // 判断是否还有下一页
              if(responseData.next){
                  // 还有下一页
                  setNextPage(prevState => prevState + 1);
              }else{
                  setNextPage(0);
              }
          })
    }, [])

    useEffect(() => {
        // console.log(id, !!id);
        if(!!id){
            // 获取当前文章的第一页数据
            setDataSource([]);
            fetchData(id, 1);
        }else{
            
        }
    }, [id, fetchData])

    const afterFetchPostHandle = useCallback(() => {
        fetchData(id, 1);
    }, [fetchData, id])

    // 渲染评论
    const discussionsElements = useMemo(() => {
        let elements = dataSource.map((item, index) => {
            // 先渲染parent
            let itemElement;
            let parent = item.parent;
            // 生成评论链
            let discussionsArray = [item];
            while(parent){
                discussionsArray.push(parent);
                // parentElement = <CommentItem data={parent} key={parent.id}>{parentElement}</CommentItem>;
                parent = parent.parent;
            }
            // 开始处理parentElenment
            for(var i=0; i < discussionsArray.length; i++){
                let data = discussionsArray[i]
                itemElement = (
                    <DiscussionItem key={`${item.id}-${data.id}`}
                      data={data} afterFetchPostHandle={afterFetchPostHandle}>
                        {itemElement}
                    </DiscussionItem>
                );
            }
            // 返回当前item的讨论Item
            return itemElement;
        });

        return elements;
    }, [afterFetchPostHandle, dataSource]);

    // 讨论分类变更
    const categoryOnChange = useCallback((e) => {
        setCategory(e.target.value);
        // e.stopParagration();
        // console.log(e);
        e.stopPropagation();
    }, [])

    // 输入框内容变更
    const handleInputChange = useCallback(e => {
        e.stopPropagation();
        setContent(e.target.value);
    }, []);

    // 发起讨论
    const fetchCreateDiscussion = useCallback((category, content, parent) => {
        if(!content){
            return;
        }
        let url = "/api/v1/docs/discussion/create";
        let data = {
            article: id,
            category,
            content,
            parent
        }
        // 发起post请求
        fetchApi.Post(url, {}, {
            data
        })
          .then(responseData => {
            //   console.log(responseData);
              if(responseData.id > 0){
                  message.success("添加评论成功", 3);
                  setContent(null);
                  fetchData(id, 1);
              }else{
                  message.warn("评论失败：" + JSON.stringify(responseData), 5);
              }
              
          })
            .catch(err => {
                console.log(err);
                message.error("评论失败", 5);
            })
    }, [fetchData, id])

    return (
        <div className="discussions">
            <div className="add">
                <Input.TextArea value={content} autoSize={{minRows: 2, maxRows: 6}} onChange={handleInputChange}/>
                <div className="buttons">
                    <Radio.Group defaultValue={category} buttonStyle="solid" onChange={categoryOnChange}>
                        <Radio.Button value="discussion">讨论</Radio.Button>
                        <Radio.Button value="comment">评论</Radio.Button>
                        <Radio.Button value="ask">提问</Radio.Button>
                        <Radio.Button value="issue">问题</Radio.Button>
                        <Radio.Button value="feedback">反馈</Radio.Button>
                    </Radio.Group>
                    <Button type="primary" 
                      onClick={() => fetchCreateDiscussion(category, content)}
                      disabled={!content}
                      className="float-right">提交</Button>
                </div>
            </div>
            <div className="list">
                {discussionsElements}
            </div>
            
            {nextPage > 0 ? <div className="more" onClick={() => fetchData(id, nextPage)}>还有下一页</div> : null}
        </div>
    )
    
}

export default ArticleDiscussionsList;