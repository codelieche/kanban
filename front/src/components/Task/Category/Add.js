/**
 * 分类添加页面
 */
import React from "react";
import { Link } from "react-router-dom";
import {
    Breadcrumb,
    message
} from "antd";

import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";
import CategoryForm from "./Form";

function CategoryAdd(props){
    // 添加
    const handleAddSubmit = values => {
        // console.log(values);
        // 通过fetch POST添加Category
        const url = "/api/v1/task/category/create";
        let formData = new FormData();
        for(var k in values){
            let v = values[k];
            // console.log(k, v);
            if (k === "image"){
                if(v instanceof Array){
                    for(var i=0; i < v.length; i++){
                        formData.append("image", v[i]);
                    };
                }
            }else{
                formData.append(k, v);
            }
        }

        fetchApi.Post(url, formData, {})
          .then(data => {
              console.log(data);
              if(data.id > 0){
                  // 当data中有id字段，就表示添加成功了，跳转去category的详情页
                  message.success(`添加分类(id:${data.id})成功`, 5);
                  props.history.push(`/task/category/${data.id}`);

              }else{
                message.warn(`添加分类失败`, 5);
                message.error(JSON.stringify(data), 8);
              }
          })
            .catch(err => {
                message.error(`添加分类出错`, 5);
                console.log(err);
            });
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
                    <h4>添加分类</h4>
                </div>
                <CategoryForm 
                  data={{}} type={"add"}
                  handleSubmit={handleAddSubmit} />
            </div>
            {/* 主体内容结束 */}
        </div>
    );
}

export default CategoryAdd;
