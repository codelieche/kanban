/**
 * 分组编辑页面
 */
import React, { useState, useEffect, useContext } from "react";
import {
    message
} from "antd";

import { GlobalContext } from "../../Base/Context";
import fetchApi from "../../Utils/fetchApi";
import CategoryForm from "./Form";

function CategoryEditor(props){
    // 状态处理器: id和data
    const [id, idState] = useState(null);
    
    const [data, dataState] = useState({});
    // 获取context
    const { setNavData } = useContext(GlobalContext);

    // 当id变化的时候：修改id
    useEffect(() => {
        // console.log(props.match.params.id);
        if(props.match.params.id !== id){
            idState(props.match.params.id);
            // 获取数据：每次得到新的id了就需要重新获取一下数据
            fetchData(props.match.params.id);
        }
    }, [props.match.params.id, id]);

    // 获取数据：会修改data的值
    const fetchData = (id) => {
        let url = `/api/v1/docs/group/${id}`;
        fetchApi.Get(url)
          .then(data => {
              if(data.id > 0){
                  //   修改状态
                  dataState(data);
              }
          })
            .catch(err => {
                console.log(err);
                message.warn("获取详情数据失败", 5);
            });
    }

    // 处理编辑操作：注意对image的处理
    const handleEditSubmit = values => {
        // console.log(values);
        // 通过fetch POST添加Category
        const url = `/api/v1/docs/group/${id}`;
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
        // formData.delete("code");
        
        // console.log(formData);
        fetchApi.Patch(url, formData, {})
          .then(data => {
            //   console.log(data);
              if(data.id > 0){
                  // 当data中有id字段，就表示添加成功了，跳转去category的详情页
                  // 显示结果：跳转去详情页
                  message.success(`修改分组(id:${data.id})成功`, 5);
                  props.history.push(`/docs/group/${data.id}`);

              }else{
                  message.warn(`修改分组(id:${data.id})失败`, 5);
                  message.error(JSON.stringify(data), 8);
              }
          })
            .catch(err => {
                console.log(err);
                message.error(`修改分组(id:${data.id})出错`, 5);
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
                title: "编辑"
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
                    <h4>编辑分组</h4>
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
