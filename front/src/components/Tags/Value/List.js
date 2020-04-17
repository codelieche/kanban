/**
 * 标签Value的列表页
 */
import React, {useState, useEffect, useCallback, useContext, useMemo} from "react";
import { Link } from "react-router-dom";
import {
    Row, Popconfirm, message
} from "antd";

import { GlobalContext } from "../../Base/Context";
import Icon from "../../Base/Icon";
import BaseTable from "../../Page/BaseTable";
import fetchApi from "../../Utils/fetchApi";

export const TagsValueList = (props) => {
    // 状态
    const [reFreshTimes, setReFreshTimes] = useState(0); // 控制刷新
    // 全局设置导航的函数
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
                title: "标签值",
                link: "/tags/value"
            },
            {
                title: "列表"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    // paramsFields字段：通过url可获取到的字段信息
    const paramsFields = useMemo(() => {
        return ["page", "search", "ordering", "is_hot", "is_deleted", "key__key", "key"]
    }, [])

    // 表格的filter字段
    const filterColumns = useMemo(() => {
        return ["is_hot", "is_deleted"]
    }, [])

    // 取消设置
    const handleCancel = useCallback(() => {
        message.info("取消设置");
    }, [])

    // 设置为hot或者普通
    const patchUpdateTagValue = useCallback((id, data) => {
        if(!id || id <= 0){
            return;
        }
        let url = `/api/v1/tags/tagvalue/${id}`;
        fetchApi.Patch(url, {}, {data: {is_hot: data.is_hot}})
          .then(responseData => {
              if(responseData.id > 0){
                  message.success("修改标签Value成功");
                  setReFreshTimes(prevState => prevState + 1);
              }else{
                  message.warn("修改标签Value失败！");
              }
          })
            .catch(err => {
                console.log(err);
                message.error("修改标签Value出错！");
            })
    }, [])

    // 表格的列数据
    const columns = useMemo(() => {
        return [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a, b) => {},
                width: 70,
            },
            {
                title: "Key",
                dataIndex: "key",
                key: "key__key",
                width: 120,
                ellipsis: true,
            },
            {
                title: "Value",
                dataIndex: "value",
                key: "value",
                ellipsis: true,
                width: 120
            },
            {
                title: "热门",
                dataIndex: "is_hot",
                key: "is_hot",
                width: 100,
                render: (text, record) => {
                    let tagValue = `${record.key}-${record.value}`;
                    return (
                        <Popconfirm
                          title={text ? `是否设置(${tagValue})为普通？` : `是否设置(${tagValue})为热门？`}
                          onCancel={handleCancel}
                          onConfirm={() => patchUpdateTagValue(record.id, {is_hot: !text})}
                        >
                            <span className="status">
                                <Icon type={text ? "check" : "close"} />
                            </span>
                        </Popconfirm>
                    )
                },
                filters: [
                    { text: <span>热门<span style={{color:"red"}}><Icon type="fire"/></span></span>, value: "true" },
                    { text: "普通", value: "false" }
                  ],
                  filterMultiple: false,
                  onFilter: (value, record) => record.is_hot.toString() === value
            },
            {
                title: "状态",
                dataIndex: "is_deleted",
                key: "is_deleted",
                width: 100,
                render: (text, record) => {
                    return (
                        <span className="status">
                            <Icon type={text ? "close" : "check"} />
                        </span>
                    )
                },
                filters: [
                    { text: "有效", value: "false" },
                    { text: "禁用", value: "true" }
                  ],
                  filterMultiple: false,
                  onFilter: (value, record) => record.is_deleted.toString() === value
            },
            {
                title: "操作",
                key: "action",
                ellipsis: true,
                render: (text, record) => {
                    return (
                        <span>
                            <Link to={`/tags/objecttag/list?tagvalue=${record.id}`}>
                                <Icon type="link"></Icon>对象列表
                            </Link>
                        </span>
                    )
                }
            }
        ]
    }, [handleCancel, patchUpdateTagValue])

    return (
        <div className="content">
            <div className="main">
                <Row className="title">
                    <h4>标签值列表</h4>
                </Row>
                {/* 显示标签Value列表 */}
                <BaseTable
                    columns={columns}
                    filterColumns={filterColumns} // filter会用到
                    paramsFields={paramsFields}  // url传递的参数
                    location={props.location}
                    history={props.history}
                    apiUrlPrefix="/api/v1/tags/tagvalue/list"
                    pageUrlPrefix="/tags/value/list"
                    reFreshTimes={reFreshTimes}  // 控制刷新
                />
            </div>
            
        </div>
    )
}

export default TagsValueList;