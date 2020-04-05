/**
 * Article列表页
 */
import React, {useState, useEffect, useContext, useMemo} from "react"
import {
    Button,
    Row,
    Spin
} from "antd";

import Icon from "../../Base/Icon";
import BasePaginationData from "../../Page/BasePaginationData";

import { GlobalContext } from "../../Base/Context";
import { ArticleListInfoItem } from "./InfoItem";

export const ArticleList = (props) => {
    // 状态
    const [dataSource, setDataSource] = useState([]);
    const [reFreshTimes, setReFreshTimes] = useState(0);

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

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "page_size", "search", "ordering", "parent", "is_active"];
    }, [])

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
                  >
                      {/* 文章列表数据 */}
                      <div className="articles-list">
                        <div className="articles">
                            <Spin spinning={false}>
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