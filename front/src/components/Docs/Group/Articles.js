/**
 * 分组的文章页
 */
import React, {useState, useEffect, useMemo} from "react";
import { Link } from "react-router-dom";
import {
    Row, 
} from "antd";

import Icon from "../../Base/Icon";
// import GroupArticlesTable from "./ArticlesTable";
import BaseTable from "../../Page/BaseTable";


export const GroupArticlesPage = (props) => {
    // 状态
    const [groupID, setGroupID] = useState("");

    // 修改分组id
    useEffect(() => {
        if(props.match.params.id !== groupID){
            setGroupID(props.match.params.id);
        }
    }, [groupID, props.match.params.id, setGroupID])

    // params字段:通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "parent", "level", "is_deleted"];
        
    // 为了让当切换了另外一个分组的时候，触发表格的更新
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.id]);

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["is_deleted", "parent"]
    }, [])

    // 表格的列
    const columns = useMemo(() => {
        return [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a, b) => {},
                render: (text, record) => {
                    return <Link to={`/docs/article/${text}`}>{text}</Link>;
                },
                ellipsis: true,
                width: 50,
            },

            {
                title: "标题",
                dataIndex: "title",
                key: "title",
                width: 250,
                ellipsis: true,
            },
            {
                title: "父级页面",
                dataIndex: "parent",
                key: "parent",
                width: 180,
                ellipsis: true,
                render: (text, record) => {
                    if(!!text){
                        return (
                            <Link to={`/docs/article/${text.id}`}>
                                <Icon type="link" />
                                {text.title}
                            </Link>
                        );
                    }else{
                        return (
                            <div>---</div>
                        )
                    }
                }
            },
            {
                title: "添加者",
                dataIndex: "user",
                key: "user",
                width: 100,
                ellipsis: true,
                sorter: () => {}
            },
            {
                title: "创建时间",
                dataIndex: "time_added",
                key: "time_added",
                width: 180,
                ellipsis: true,
                sorter: (a, b) => {}
            },
            {
                title: "操作",
                key: "action",
                // width: 200,
                ellipsis: true,
                render: (text, record) => {
                    return (
                        <div>
                            {/* 查看详情 */}
                            <Link to={`/docs/article/${record.id}`}>
                                <Icon type="link" />查看详情
                            </Link>
                            {/* 查看属性 */}
                        </div>
                    )
                }
            }
        ]
    }, [])


    return (
        <div className="content">
            <div className="main">
                <Row className="title">
                    <h4>文章列表</h4>
                </Row>

                {/* <GroupArticlesTable 
                    groupID={groupID} 
                    location={props.location} 
                    history={props.history}
                    apiUrlPrefix={ groupID ? `/api/v1/docs/group/${groupID}/articles` : null}
                    pageUrlPrefix={`/docs/group/${groupID}/articles`}
                /> */}

                {/* 列表 */}
                <BaseTable 
                    columns={columns} 
                    filterColumns={filterColumns}  // filter会用到
                    paramsFields={paramsFields}  // url传递的参数

                    groupID={groupID} 
                    location={props.location} 
                    history={props.history}
                    
                    apiUrlPrefix={ groupID ? `/api/v1/docs/group/${groupID}/articles` : null}
                    pageUrlPrefix={`/docs/group/${groupID}/articles`}
                />
            </div>
        </div>
        
    );
}

export default GroupArticlesPage;
