/**
 * 文章详情页
 */

import React, {useState, useMemo, useCallback, useEffect} from "react";
import { Link } from "react-router-dom";

import {
    // Typography,
    message
} from "antd";

import EditableContent from "../../Base/EditableContent";
import Icon from "../../Base/Icon";
import fetchApi from "../../Utils/fetchApi";

export const ArticleDetail = function(props){

    // 状态
    const [articleID, setArticleID] = useState(null);
    const [data, setData] = useState({});

    const fetchDetailData = useCallback(id => {
        setArticleID(id);
        if(! id){
            return
        }
        // 开始获取数据
        let url = `/api/v1/docs/article/${id}`;
        fetchApi.Get(url, {}, {})
          .then(responseData => {
              if(responseData.id > 0){
                  setData(responseData);
              }else{
                  // 获取文章数据出错
                  message.warn("获取文章数据出错");
              }
          })
            .catch(err => {
                console.log(err);
            });
    }, [])

    useEffect(() => {
        if(props.match.params.id !== articleID){
            // setArticleID(props.match.params.id);
            fetchDetailData(props.match.params.id);
        }
    }, [props.match.params.id, fetchDetailData, articleID])

    // 文章底部的子文章列表
    let childrenListElement = useMemo(() => {
        if(Array.isArray(data.children)){
            let elements = data.children.map((item, index) => {
                // console.log(item);
                return (
                    <li key={index}>
                        <Link to={`/docs/article/${item.id}`}>
                            <Icon type="file-text-o"></Icon>
                            {item.title ? item.title : <span className="no-title">无标题</span>}
                        </Link>
                    </li>
                );
            });
            return elements;
        }else{
            return [];
        }
    }, [data]);

    // console.log(childrenListElement);

    return (
        <article>
            <header className="middle">
                <div className="title">
                    {/* <Icon type="file-text-o"></Icon> */}
                    {/* <Typography.Title editable={{editing: false, onChange: (e) => console.log(e)}}> */}
                        <h1>
                            <div contentEditable={true} suppressContentEditableWarning>
                                {data.title}
                            </div>
                        </h1>
                    {/* </Typography.Title> */}
                </div>
                <div className="description">
                    {/* <Typography.Paragraph 
                    //   editable={true}
                      editable={{onChange: (e) => console.log(e)}}
                    //   让其可显示换行
                      style={{whiteSpace: "pre-wrap"}}
                      onChange={(e) => console.log(e)}>
                        {data.description ? data.description : "无描述内容"}
                    </Typography.Paragraph> */}

                    <EditableContent 
                      content={data.description ? data.description : "默认的描述内容"}
                      type="text" // 类型是html或者text
                      tagName="div"
                      //   onChange={e => console.log(e.target.text)}
                      //  当内容更新了之后，我们需要做点操作
                      handleContentUpdated={data => console.log(data)}
                    />

                   
                </div>
            </header>
            <content>

            </content>
            <section>
                文章内容
                <hr />
                <div contentEditable={true} 
                        onChange={e => console.log(e)}
                        suppressContentEditableWarning
                        //   不显示外面的边框
                        style={{outline: "none"}}>
                        我是可编辑的内容哦！！！
                    </div>
            </section>
            {
                childrenListElement.length > 0 && (
                    <section className="children">
                        <h2>子文章列表</h2>
                        <ul>
                            {childrenListElement}
                        </ul>
                    </section>
                )
            }
            <footer>

            </footer>
        </article>
    );
}

 export default ArticleDetail;
