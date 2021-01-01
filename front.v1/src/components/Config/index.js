/**
 * 配置相关的首页
 */
import React from "react";
import {
    Switch, Route, Redirect
} from "react-router-dom";

// 配置菜单
import MenuListPage from "./Menu/List";

export const ConfigIndexPage = (props) => {
    return (
        <Switch>
            <Route exact 
              path="/config/menu/list" component={MenuListPage} />

            <Route exat 
              path="/config/menu"
              render={() => <Redirect to="/config/menu/list" push={false} />} />
              
        </Switch>
    )
}

export default ConfigIndexPage;
