/**
 * 分类编辑页面
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Breadcrumb,
    message
} from "antd";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";
import CategoryForm from "./Form";

function CategoryEditor(props){
    // 状态处理器
    const [id, idState] = useState(null);
    
    const [data, dataState] = useState({});

    // 当id变化的时候
    useEffect(() => {
        // console.log(props.match.params.id);
        if(props.match.params.id !== id){
            idState(props.match.params.id);
            // 获取数据
            fetchData(props.match.params.id);
        }
    }, [props.match.params.id, id]);

    // 获取数据
    const fetchData = (id) => {
        let url = `/api/v1/task/category/${id}`;
        fetchApi.Get(url)
          .then(data => {
              if(data.id > 0){
                  //   修改状态
                  dataState(data);
              }
          })
            .catch(err => console.log(err));
    }

    // 处理编辑操作
    const handleEditSubmit = values => {
        // console.log(values);
        // 通过fetch POST添加Category
        const url = `/api/v1/task/category/${id}`;
        fetchApi.Put(url, {}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: values,
        })
          .then(data => {
              console.log(data);
              if(data.id > 0){
                  // 当data中有id字段，就表示添加成功了，跳转去category的详情页

              }else{
                  message.error(JSON.stringify(data), 8);
              }
          })
            .catch(err => {
                console.log(err);
            })
    }

    // 相当于class写法的render(){}
    return (
        <div className="content">
            {/* 面包屑开始 */}
            <div className="nav">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/"><Icon type="home" noMarginRight={true}>首页</Icon></Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>
                        <Link to="/task/category/list">任务分类</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item>详情</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            {/* 面包屑结束 */}

            {/* 主体内容开始 */}
            <div className="main">
                <div className="title">
                    <h4>编辑分类</h4>
                </div>
                <CategoryForm 
                  data={data} type="editor"
                  handleSubmit={handleEditSubmit} />
            </div>
            {/* 主体内容结束 */}
        </div>
    );
}

export default CategoryEditor;
