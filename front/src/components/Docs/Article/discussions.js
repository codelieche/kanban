/**
 * 文章的讨论列表
 */
import React, { useState, useCallback, useEffect, useMemo} from "react";

import {
    Comment, Avatar
} from "antd";

import fetchApi from "../../Utils/fetchApi";


const CommentItem = ({data, children}) => {
    return (
        <Comment
          author={data.user}
          avatar={
          <Avatar alt={data.user}>{data.user}</Avatar>
          }
          content={data.content}
          >
              {children}
          </Comment>
    );
}

export const ArticleDiscussionsList = ({id}) => {
    // 文章id
    // const [id, setId] = useState(null);
    // 评论的列表页
    const [nextPage, setNextPage] = useState(0);
    // 获取到的评论数据
    const [dataSource, setDataSource ] = useState([]);

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
                  setDataSource(prevState => [data, ...prevState]);
              }
              // 判断是否还有下一页
              if(responseData.next){
                  // 还有下一页
                  setNextPage(prevState => prevState + 1);
              }
          })
    }, [])

    useEffect(() => {
        console.log(id, !!id);
        if(!!id){
            // 获取当前文章的第一页数据
            fetchData(id, 1);
        }else{
            
        }
    }, [id, fetchData])

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
                    <CommentItem data={data} key={data.id}>{itemElement}</CommentItem>
                );
            }
            // 返回当前item的讨论Item
            return itemElement;
        })
        if(dataSource.length > 0){
            return elements;
        }else{
            return "无讨论内容"
        }

    }, [dataSource]);

    return (
        <div className="discussions">
            {discussionsElements}
            {nextPage > 0 ? "还有下一页" : null}
        </div>
    )
    
}

export default ArticleDiscussionsList;