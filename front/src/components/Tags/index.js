/**
 * 标签相关的页面首页
 */
import React from "react";
import {
    Route,
    Switch,
    Redirect
} from "react-router-dom";

// 导入标签key相关的组件
import TagsKeyList from "./Key/List";

// 导入标签value相关的组件
import TagsValueList from "./Value/List";


export const TagsIndexPage = (props) => {
    return (
        <Switch>
            {/* 标签key相关的路由 */}
            <Route exat path="/tags/tag/list" component={TagsKeyList} />
            <Route exat path="/tags/tag"
              render={() => <Redirect to="/tags/key/list" push={false} />}
            />

            {/* 标签Value相关的路由 */}
            <Route exat path="/tags/value/list" component={TagsValueList} />
            <Route exat path="/tags/value"
              render={() => <Redirect to="/tags/value/list" push={false} />}
            />
        </Switch>
    )
}

export default TagsIndexPage;