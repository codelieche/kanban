/**
 * 分类的文章页
 */
import React, {useState, useEffect} from "react";

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
        <CategoryArticlesTable 
          categoryID={categoryID} 
          location={props.location} 
          history={props.history}
          apiUrlPrefix={ categoryID ? `/api/v1/docs/category/${categoryID}/articles` : null}
          pageUrlPrefix={`/docs/category/${categoryID}/articles`}
        />
    );
}

export default CategoryArticlesPage;
