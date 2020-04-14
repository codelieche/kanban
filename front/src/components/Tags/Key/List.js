/**
 * 标签Key的列表页
 */
import React, {useEffect, useContext} from "react";

import { GlobalContext } from "../../Base/Context";

export const TagsKeyList = (props) => {

    const { setNavData } = useContext(GlobalContext);

    // 顶部导航面包屑的数据
    // 设置导航
    useEffect(() => {
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
                title: "列表"
            }
        ]
        setNavData(navData);
    }, [setNavData])

    return (
        <div>
            标签的key列表页
        </div>
    )
}

export default TagsKeyList;