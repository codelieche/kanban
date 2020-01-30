/**
 * Docs相关的首页
 */
import React from "react";
import {
    Route,
    Switch,
    Redirect
} from "react-router-dom";

// 导入分类相关组件
import CategoryList from "./Category/List";

// 导入Article相关组件
import ArticleList from "./Article/List";

// 导入Comment相关组件
import CommontList from "./Comment/List";

class docsIndex extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return (
            <Switch>
                {/* 分类相关路由 */}
                <Route exat path="/docs/category/list" component={CategoryList} />
                <Route exat 
                  path="/docs/category" 
                  render={() => <Redirect to="/docs/category/list" push={false} />}
                />

                {/* Article相关路由 */}
                <Route exat path="/docs/article/list" component={ArticleList} />
                <Route exat 
                  path="/docs/article" 
                  render={() => <Redirect to="/docs/article/list" push={false} />}
                />

                {/* Comment相关路由 */}
                <Route exat path="/docs/comment/list" component={CommontList} />
                <Route exat 
                  path="/docs/comment" 
                  render={() => <Redirect to="/docs/comment/list" push={false} />}
                />
            </Switch>
        )
    }
}

export default docsIndex;