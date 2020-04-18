/**
 * 工具相关的页面
 */
import React from "react";
import {
    Switch,
    Route
} from "react-router-dom";

import SearchIndex from "./Search/index";

export const ToolsIndexPage = (props) => {
    return (
        <Switch>
            <Route path="/tools/search" component={SearchIndex} />
        </Switch>
    )
}

export default ToolsIndexPage;