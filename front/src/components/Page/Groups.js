/**
 * 文档分组
 */
import React, { useState, useCallback, useEffect, useMemo} from "react";
import PropTypes from "prop-types";
import {
    Row, Col,
    message
} from "antd";

import fetchApi from "../Utils/fetchApi";


export const GroupsNav = ({groups, handleGroupClick}) => {
    // 状态
    const [currentGroup, setCurrentGroup] = useState({});

    const handleClick = useCallback((e, group) => {
        // console.log(e);
        e.stopPropagation();
        handleGroupClick(group);
    }, [handleGroupClick])

    useEffect(() => {
        if(groups.length > 0){
            setCurrentGroup(groups[0]);
        }else{
            setCurrentGroup({})
        }
    }, [groups])

    const generateGroupItem = useCallback((group) => {
        return (
            <li className={currentGroup.id === group.id ? "item active" : "item"} 
              key={group.id}
              onMouseEnter={() => {setCurrentGroup(group)}}
              onClick={(e) => handleClick(e, group)}
            >
               {group.name} 
            </li>
        )
    }, [currentGroup, handleClick])

    const groupsItems = useMemo(() => {
        return groups.map(((group, index) => {
            return generateGroupItem(group)
        }))
    }, [generateGroupItem, groups])

    const generateChildrenItem = useCallback((group, level=0) => {
        let childrensElements;
        if(group.children && group.children.length > 0){
            childrensElements = group.children.map((item, index) => {
                return generateChildrenItem(item, level + 1);
            })
        }

        if(childrensElements){
            return (
                <Col className="item" key={group.id} xs={{span: 8}} lg={{span: 6}}>
                    <div 
                      className="title"
                      onClick={(e) => handleClick(e, group)}
                    >
                        {group.name}
                    </div>
                    <div className="children">
                        {childrensElements}
                    </div>
                </Col>
            )
        }
        if(level > 1){
            return (
                <div className="item" key={group.id}>
                    <div 
                      className="title" 
                      style={{paddingLeft: 5 * level}}
                      onClick={(e) => handleClick(e, group)}
                    >
                        {group.name}
                    </div>
                </div>
            )
        }else{
            return (
                <Col className="item" key={group.id} xs={{span: 8}}>
                    <div 
                      className="title" 
                      style={{paddingLeft: 5 * level}}
                      onClick={(e) => handleClick(e, group)}
                    >
                        {group.name}
                    </div>
                </Col>
            )
        }
        
    }, [handleClick])

    const currentElement = useMemo(() => {
        if(currentGroup && currentGroup.id > 0){
            if(currentGroup.children && currentGroup.children.length > 0) {
                // 顶级分组，而且是有子分组的
                return (
                    <div className="current">
                        <div className="header">
                            <div className="title">{currentGroup.name}</div>
                        </div>
                        <div className="content">
                            <Row gutter={24}>
                            {
                                currentGroup.children.map((group, index) => {
                                   return generateChildrenItem(group, 1);
                                })
                            }
                            </Row>
                        </div>
                    </div>
                )
            }else{
                // 顶级分组,无子分组
                return null;
                // return (
                //     <div className="current">
                //         <div className="header">
                //             <div className="title">{currentGroup.name}</div>
                //             <div className="description">
                //                 {currentGroup.description}
                //             </div>
                //         </div>
                //         <div className="content">
                //             <div className="logo">
                //                 {currentGroup.image && (
                //                     <img src={currentGroup.image} alt="logo" />
                //                 )}
                //             </div>
                //         </div>
                //     </div>
                // )
            }
            
        }else{
            return (
                <span></span>
            )
        }
    }, [currentGroup, generateChildrenItem])

    return (
        <div className="groups-nav">
            <div className="groups">
                <ul>
                    {groupsItems}
                </ul>
            </div>
            {/* <div className="current"> */}
                {currentElement}
            {/* </div> */}
        </div>
    )
}

GroupsNav.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleGroupClick: PropTypes.func.isRequired, // group点击处理函数
}

export const GroupsTest = (props) => {
    // 状态
    const [groups, setGroups] = useState([]);

    // 获取分组的列表
    const fetchGroupsData = useCallback(() => {
        let url = "/api/v1/docs/group/all";
        fetchApi.Get(url)
          .then(responseData => {
              if(Array.isArray(responseData)){
                  setGroups(responseData);
              }else{
                  message.warn("获取分组列表数据出错", 3);
              }
          })
            .catch(err => {
                console.log(err);
            })
    }, [setGroups])

    useEffect(() => {
        // 获取分类数据
        if(groups.length === 0 ){
            fetchGroupsData();
        }

    }, [groups.length, fetchGroupsData])

    return (
        <GroupsNav 
          groups={groups}
          handleGroupClick={(group) => {console.log(group)}}
        />
    )
}

export default GroupsNav;
