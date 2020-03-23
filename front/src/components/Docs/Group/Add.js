/**
 * 分组添加页面
 */
import React, { useEffect, useContext } from "react";
import {
    message
} from "antd";

import { GlobalContext } from "../../Base/Context";
// import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";
import CategoryForm from "./Form";

function CategoryAdd(props){

    // 获取context
    const { setNavData } = useContext(GlobalContext);

    // 添加
    const handleAddSubmit = values => {
        // console.log(values);
        // 通过fetch POST添加Category
        const url = "/api/v1/docs/group/create";
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
            //   console.log(data);
              if(data.id > 0){
                  // 当data中有id字段，就表示添加成功了，跳转去category的详情页
                  message.success(`添加分组(id:${data.id})成功`, 5);
                  props.history.push(`/docs/group/${data.id}`);

              }else{
                message.warn(`添加分组失败`, 5);
                message.error(JSON.stringify(data), 8);
              }
          })
            .catch(err => {
                message.error(`添加分组出错`, 5);
                console.log(err);
            });
    }

    // 设置导航
    useEffect(() => {
        // 顶部导航面包屑的数据
        const navData = [
            {
                title: "首页",
                icon: "home",
                link: "/"
            },
            {
                title: "文档分组",
                link: "/docs/group"
            },
            {
                title: "添加"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    // 相当于class写法的render(){}
    return (
        <div className="content">

            {/* 主体内容开始 */}
            <div className="main">
                <div className="title">
                    <h4>添加分组</h4>
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
