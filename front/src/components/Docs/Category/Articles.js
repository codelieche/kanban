/**
 * 分类的文章页
 */
import React, {useState, useEffect} from "react";

import {
    Row, 
} from "antd";

import CategoryArticlesTable from "./ArticlesTable";


export const CategoryArticlesPage = (props) => {

    // 状态
    const [categoryID, setCategoryID] = useState("");

    // 修改分类id
    useEffect(() => {
        if(props.match.params.id !== categoryID){
            setCategoryID(props.match.params.id);
        }
    }, [categoryID, props.match.params.id, setCategoryID])

    return (
        <div className="content">
            <div className="main">
                <Row className="title">
                    <h4>文章列表</h4>
                </Row>

                <CategoryArticlesTable 
                    categoryID={categoryID} 
                    location={props.location} 
                    history={props.history}
                    apiUrlPrefix={ categoryID ? `/api/v1/docs/category/${categoryID}/articles` : null}
                    pageUrlPrefix={`/docs/category/${categoryID}/articles`}
                />
            </div>
        </div>
        
    );
}

export default CategoryArticlesPage;
