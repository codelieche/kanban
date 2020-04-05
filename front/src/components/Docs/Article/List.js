/**
 * Article列表页
 */
import React, {useState, useEffect, useContext, useMemo, useCallback} from "react"
import {
    Button,
    Row,
    Spin,
    Tag,
    message
} from "antd";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";
import { getParamsFromLocationSearch } from "../../Utils/UrlParam";
import BasePaginationData from "../../Page/BasePaginationData";

import { GlobalContext } from "../../Base/Context";
import { ArticleListInfoItem } from "./InfoItem";

export const ArticleList = (props) => {
    // 状态
    const [dataSource, setDataSource] = useState([]);
    const [reFreshTimes, setReFreshTimes] = useState(0);
    const [groups, setGroups] = useState([
        {
            name: "全部",
            id: 0,
        }
    ]);
    const [currentGrooupID, setCurrentGroupID] = useState(0);
    const [ loading, setLoading ] = useState(true);
    const { setNavData } = useContext(GlobalContext);

    // 顶部导航面包屑的数据
    // 设置导航
    useEffect(() => {
        const navData = [
            {
                title: "首页",
                icon: "home",
                link: "/"
            },
            {
                title: "文章",
                link: "/docs/article/list"
            },
            {
                title: "列表"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    // 从url中获取group_id
    useEffect(() => {
        // 对params中的字段做处理：记得去掉page
        // 引入如果调用状态中的urlParams，获取到的可能不是最新值，所以这里从url中解析值
        let locationSearch = props.location.search;
        // console.log(locationSearch);
        let urlParams = getParamsFromLocationSearch(["group_id"], locationSearch)
        // console.log(urlParams);
        let groupIDStr = urlParams["group_id"];
        
        if(parseInt(groupIDStr, 10)){
            setCurrentGroupID(parseInt(groupIDStr, 10));
        }else{
            setCurrentGroupID(0);
        }

    }, [props.location.search])

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

    // 执行获取分组列表
    useEffect(() => {
        fetchGroupsData();
        // fetchArtcilesListData()
    }, [fetchGroupsData]);

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "page_size", "group_id", "search", "ordering", "parent", "is_active"];
    }, [])

    // 分组变化
    const handleGroupOnChange = useCallback((groupID) => {
        if(currentGrooupID !== groupID){
            setCurrentGroupID(groupID);
            let url = "/docs/article/list";
            if(groupID > 0){
                url = `/docs/article/list?group_id=${groupID}`
            }
            props.history.push(url);
        }
    }, [currentGrooupID, props.history])

    // 分组的标签选项
    const groupsTagList = useMemo(() => {
        return groups.map((item, index) => {
            return (
                <Tag.CheckableTag checked={currentGrooupID === item.id} onChange={() => handleGroupOnChange(item.id)} key={item.id}>
                    {item.name}
                </Tag.CheckableTag>
            );
        });
    }, [currentGrooupID, groups, handleGroupOnChange])

    // 右侧按钮
    const rightButtons = useMemo(() => {
        return (
            <span>
                <Button
                    style={{width: 100}}
                    type="default"
                    // icon="reload"
                    icon={<Icon type="refresh"/>}
                    onClick={() => {setReFreshTimes(preState => preState + 1)}}
                >
                    刷新
                </Button>
                
                {/* <Button
                    type="primary"
                    style={{width: 100}}
                    icon={<Icon type="plus"/>}
                    >
                    Add
                </Button> */}
                
            </span>
        )
}, []);

    const articlesItemElements = useMemo(() => {
        if( Array.isArray(dataSource) ){
            return dataSource.map((item, index) => {
                    return <ArticleListInfoItem data={item} key={item.id} />
                });
            
        }else{
            return null;
        }
    }, [dataSource])

    return (
        <div className="content">
            <div className="main">
                <Row className="title">
                    <h4>文章列表</h4>
                </Row>

                {/* 文章的分组 */}
                <div className="tags-list">
                    {/* <div className="title">分组：</div> */}
                    <div className="list">
                        {groupsTagList}
                    </div>
                </div>

                {/* 显示分页数据 */}
                <BasePaginationData
                  showTools={true}
                  paramsFields={paramsFields}  // url传递的参数
                  pageSize={10}
                  location={props.location}
                  history={props.history}
                  apiUrlPrefix="/api/v1/docs/article/list"
                  pageUrlPrefix="/docs/article/list"
                  setDataSource={setDataSource}  // 把分页获取到的数据写入到当前页来
                  hideOnSinglePage={false}
                  reFreshTimes={reFreshTimes}  // 刷新数据
                  rightButtons={rightButtons}  // 右侧按钮
                  setLoading={setLoading}      // 设置加载状态
                  >
                      {/* 文章列表数据 */}
                      <div className="articles-list">
                        <div className="articles">
                            <Spin spinning={loading}>
                                {articlesItemElements}
                            </Spin>
                        </div>
                      </div>
                  </BasePaginationData>
            </div>
        </div>
    );
}

export default ArticleList;