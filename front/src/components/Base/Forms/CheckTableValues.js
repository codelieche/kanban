/**
 * 从表单中选择值
 */
import React, {useState, useEffect} from "react";
import {
    Table
} from "antd";

import fetchApi from "../../Utils/fetchApi";

// 参数：
// -: checkValues: 选择的数据数组
// - checkValuesState: 操作checkValues的函数与checkValues是成对出现的
// - dataSourceUrl: 表单数据的api接口
// - columns: 表单的列
// - rowKey: 唯一值列的字段名
// - isMultiple: 是否选择多个值
// - disabledKeys: 禁用的keys列表
// - showSubs: 是否显示子列表
// function CheckValuesFromTable(props){
function CheckValuesFromTable({checkValues, checkValuesState, dataSourceUrl, columns, rowKey="id", isMultiple=true, disabledKeys=[], showSubs=false}){
    // checkValues, checkValuesState, dataSourceUrl, columns, rowKey="id", isMultiple=true, disabledKeys=[], showSubs=false
    // 保存api获取的数据的state
    // 第1个state：数据源的url
    // console.log("CheckValuesFromTable");
    const [url, urlState] = useState(null);

    // 相当于：componentDidMound，componentDidUpdate, componentWillUnMount
    useEffect(() => {
        // console.log(dataSourceUrl);
        if(dataSourceUrl !== url){
            // data["dataSourceUrl"] = dataSourceUrl;
            // 修改状态
            urlState(dataSourceUrl);
            // 获取数据
            if(dataSourceUrl){
                fetchData(dataSourceUrl, 1);
            }
        }
    }, [url, dataSourceUrl]);

    // 第2个state：通过url获取到的数据
    const [dataSource, dataSourceState] = useState([]);

    // 第3个state：列表的分页
    const [pagination, paginationState] = useState({current: 1, total: 0});

    // 选择的keys
    // const [selectedRowKeys, selectedRowKeysState] = useState([]);
    
    // 获取数据
    const fetchData = (url, page) => {
        // console.log("fetchData");
        let fetchUrl = url;
        if(fetchUrl.indexOf("?") > 0){
            fetchUrl = `${fetchUrl}&page=${page}`;
        }else{
            fetchUrl = `${fetchUrl}?page=${page}`;
        }
        fetchApi.Get(fetchUrl)
        .then(responseData => {
            if(responseData instanceof Array){
                dataSourceState(responseData);
            }else{
                let results = responseData["results"];
                if (results instanceof Array){
                    //   修改状态
                    dataSourceState(results);
                    // 修改pagination的状态
                    paginationState({current: page, total: responseData["count"]});
                }
            }
        })
            .catch(err => {
                console.log(err);
            });
    };

    // 行选择
    const rowSelection = {
        hideDefaultSelections: true,
        selectedRowKeys: checkValues ? checkValues : [],
        onChange: (selectedRowKeys) => {
            // console.log(selectedRowKeys);
            // checkValuesState(selectedRowKeys);
            checkValuesState(selectedRowKeys);
        },
        type: isMultiple ? "checkbox" : "radio",
        getCheckboxProps: record => ({
            disabled: function(){
                if(disabledKeys && disabledKeys instanceof Array){
                    for(var i=0; i < disabledKeys.length; i++){
                        if (record[rowKey] === disabledKeys[i]){
                            return true;
                        }
                    }
                }
                
                return false;
            }(),
            // 注意这里，如果rowKey是id的话，那么数字是不可以作为name的
            name: record[rowKey] ? record[rowKey].toString() : "---",
          }),
    }

    // onhandle
    function onChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
        let currentPage = pagination.current;
        fetchData(dataSourceUrl, currentPage);
      }

    //   console.log(checkValues);
    // 显示展开
    const expandable = { 
        expandedRowRender: record => {
            if(record.subs.length > 0){
                return (
                    <Table 
                      showHeader={false}
                      bordered={false}
                      dataSource={record.subs} 
                      rowKey={rowKey}
                      //   columns={columns.slice(0, 6)} 
                      size="small"
                      rowSelection={rowSelection}
                      columns={columns} 
                      pagination={false}
                      expandable={showSubs ? expandable : undefined}
                    />
                );
            }else{
                return null;
            }
        },
        rowExpandable: record => record.subs.length > 0,
    };

    return (
        <div>
            <Table
              title={() => checkValues.length > 0 ? `当前选中的值有：${JSON.stringify(checkValues)}` : null}
              columns={columns}
              dataSource={dataSource}
              pagination={pagination}
              onChange={onChange}
              rowKey={rowKey}
              rowSelection={rowSelection}
              bordered={true}
              expandable={showSubs ? expandable : undefined}
            >
            </Table>
        </div>
    );

}

export default CheckValuesFromTable;
