/**
 * 最新文章列表
 */
import React, { useState, useEffect, useCallback, useMemo} from "react";
import { Link } from "react-router-dom";
import {
    Tag, Spin, message
} from "antd";

import fetchApi from "../../Utils/fetchApi";
import { ShowObjectTags } from "../../Page/Tags";

export const LatestArticlesList = (props) => {
    // 状态
    const [currentGrooupID, setCurrentGroupID] = useState(0);
    const [groups, setGroups] = useState([
        {
            name: "全部",
            id: 0,
        }
    ]);
    // 文章
    const [articlesList, setArticleList] = useState([]);
    const [loading, setLoading] = useState(true);

    // 获取用户所有的分组
    const fetchGroupsData = useCallback(() => {
        let url = "/api/v1/docs/group/all";
        fetchApi.Get(url, {}, {})
          .then(data => {
              if(Array.isArray(data)){
                  setGroups([{name: "全部", id: 0}, ...data]);
              }else{
                  message.warn(JSON.stringify(data), 5);
              }
          })
            .catch(err => {
                console.log(err);
                message.error("获取分组列表出错！", 5);
            })
    }, []);

    // 获取分组的文章
    const fetchArtcilesListData = useCallback((groupID) => {
        // 得到id
        let url = "/api/v1/docs/article/list?ordering=-time_added";
        setLoading(true);
        if(groupID > 0){
            url = `${url}&group=${groupID}`;
        }
        // 发起Get请求，获取数据
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              setLoading(false);
              let data = responseData.results;
              if(Array.isArray(data)){
                setArticleList(data);
              }else{
                  // 获取文章列表出错
                  message.warn(JSON.stringify(responseData), 5);
              }
          })
           .catch(err => {
               console.log(err);
               setLoading(false);
           })
    }, [])

    // 执行获取分组列表
    useEffect(() => {
        fetchGroupsData();
        // fetchArtcilesListData()
    }, [fetchGroupsData, fetchArtcilesListData]);

    // 监测当前分组的变化
    useEffect(() => {
        fetchArtcilesListData(currentGrooupID);
    }, [currentGrooupID, fetchArtcilesListData])

    // 分组的标签选项
    const groupsTagList = useMemo(() => {
        return groups.map((item, index) => {
            return (
                <Tag.CheckableTag checked={currentGrooupID === item.id} onChange={() => setCurrentGroupID(item.id)} key={item.id}>
                    {item.name}
                </Tag.CheckableTag>
            );
        });
    }, [currentGrooupID, groups])

    // 文章列表
    const articlesItemElements = useMemo(() => {
        
        return articlesList.map((item, index) => {
            return (
                <div className="article-item" key={item.id}>
                    { item.cover && (
                        <Link to={`/docs/article/${item.id}`}>
                            <div className="cover">
                                <img src={item.cover} alt="封面" />
                            </div>
                        </Link>
                    )}
                    <div className="content">
                        <div className="title">
                            <Link to={`/docs/article/${item.id}`}>
                                <h2>{item.title}</h2>
                            </Link>
                        </div>
                        <div className="metadata">
                            {/* 显示文章的标签 */}
                            <ShowObjectTags 
                              appLabel="docs" model="article" objectID={item.id}/>
                            <span className="item">时间: {item.time_added}</span>
                            <span className="item">作者: {item.user}</span>
                        </div>

                        {!!item.description && (
                        <div className="description">
                            {item.description}
                        </div>)}
                    </div>
                    
                </div>
            );
        })
    }, [articlesList])

    return (
        <div className="articles">
            <div className="tags-list border-bottom">
                {/* <div className="title">工作区：</div> */}
                <div className="list">
                    {groupsTagList}
                </div>
            </div>

            <Spin spinning={loading}>
                <div className="articles-list">
                    {articlesItemElements}
                </div>
            </Spin>
            
        </div>
    )
}

export default LatestArticlesList;