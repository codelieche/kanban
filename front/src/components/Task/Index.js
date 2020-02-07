/**
 * 任务相关的首页
 */
import React from "react";
import {
    Route,
    Switch,
    Redirect
} from "react-router-dom";

// 导入分类相关组件
import CategoryList from "./Category/List";
import CategoryAdd from "./Category/Add";
import CategoryDetail from "./Category/Detail";
import CategoryEditor from "./Category/Editor";


// 导入Job相关组件
import JobList from "./Job/List";

// 导入Comment相关组件
import CommontList from "./Comment/List";

function TaskIndex(props) {

        return (
            <Switch>
                {/* 分类相关路由 */}
                <Route exat path="/task/category/list" component={CategoryList} />
                <Route exat={true} path="/task/category/add" component={CategoryAdd} />
                <Route exat path="/task/category/:id/editor" component={CategoryEditor} />
                <Route exat={true} path="/task/category/:id" component={CategoryDetail} />
                <Route exat 
                  path="/task/category" 
                  render={() => <Redirect to="/task/category/list" push={false} />}
                />

                {/* Job相关路由 */}
                <Route exat path="/task/job/list" component={JobList} />
                <Route exat 
                  path="/task/job" 
                  render={() => <Redirect to="/task/job/list" push={false} />}
                />

                {/* Comment相关路由 */}
                <Route exat path="/task/comment/list" component={CommontList} />
                <Route exat 
                  path="/task/comment" 
                  render={() => <Redirect to="/task/comment/list" push={false} />}
                />
            </Switch>
        );
}

export default TaskIndex;