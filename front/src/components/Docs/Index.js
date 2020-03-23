/**
 * Docs相关的首页
 */
import React from "react";
import {
    Route,
    Switch,
    Redirect
} from "react-router-dom";

// 导入分组相关组件:
import GroupList from "./Group/List";
import GroupAdd from "./Group/Add";
import GroupDetail from "./Group/Detail";
import GroupEditor from "./Group/Editor";
import GroupArticlesPage from "./Group/Articles";

// 导入Article相关组件:
import ArticleList from "./Article/List";

// 导入Comment相关组件:
import CommontList from "./Comment/List";

import DiscussionList from "./Discussion/List";

function DocsIndex(props){
      return (
          <Switch>
              {/* 分组相关路由 */}
              <Route exat path="/docs/group/list" component={GroupList} />
              <Route exat path="/docs/group/add" component={GroupAdd} />
              <Route exat path="/docs/group/:id/editor" component={GroupEditor} />
              <Route exat path="/docs/group/:id/articles" component={GroupArticlesPage} />
              <Route exat path="/docs/group/:id" component={GroupDetail} />
              <Route exat 
                path="/docs/group" 
                render={() => <Redirect to="/docs/group/list" push={false} />}
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

              <Route exat path="/docs/discussion/list" component={DiscussionList} />
              <Route exat 
                path="/docs/discussion" 
                render={() => <Redirect to="/docs/discussion/list" push={false} />}
              />
          </Switch>
      );
}

export default DocsIndex;