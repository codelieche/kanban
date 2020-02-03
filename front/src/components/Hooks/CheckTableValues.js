/**
 * 从表单中选择值
 */
import React, {useState, useEffect} from "react";
import {
    Table
} from "antd";

import fetchApi from "../Utils/fetchApi";

// 参数：
// -: checkValues: 选择的数据数组
// - checkValuesState: 操作checkValues的函数与checkValues是成对出现的
// - dataSourceUrl: 表单数据的api接口
// - columns: 表单的列
// - rowKey: 唯一值列的字段名
// - isMultiple: 是否选择多个值
// - disabledKeys: 禁用的keys列表
function useCheckValuesFromTable(checkValues, checkValuesState, dataSourceUrl, columns, rowKey="id", isMultiple=true, disabledKeys=[]){
    // 保存api获取的数据的state
    const [url, urlState] = useState(null);
    const [dataSource, dataSourceState] = useState([]);
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

    // 相当于：componentDidMound，componentDidUpdate, componentWillUnMount
    useEffect(() => {
        // console.log(dataSourceUrl);
        if(dataSourceUrl !== url){
            // data["dataSourceUrl"] = dataSourceUrl;
            // 修改状态
            urlState(dataSourceUrl);
            // 获取数据
            fetchData(dataSourceUrl, 1);
        }
    }, [url, dataSourceUrl]);


    // 行选择
    const rowSelection = {
        hideDefaultSelections: true,
        selectedRowKeys: checkValues,
        onChange: (selectedRowKeys) => {
            // console.log(selectedRowKeys);
            // checkValuesState(selectedRowKeys);
            checkValuesState(selectedRowKeys);
        },
        type: isMultiple ? "checkbox" : "radio",
        getCheckboxProps: record => ({
            disabled: function(){
                for(var i=0; i < disabledKeys.length; i++){
                    if (record[rowKey] === disabledKeys[i]){
                        return true;
                    }
                }
                return false;
            }(),
            name: record[rowKey],
          }),
    }

    // onhandle
    function onChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
        let currentPage = pagination.current;
        fetchData(dataSourceUrl, currentPage);
      }

    //   console.log(checkValues);

    return (
        <div>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={pagination}
              onChange={onChange}
              rowKey={rowKey}
              rowSelection={rowSelection}
              bordered={true}
            >
            </Table>
        </div>
    );

}

export default useCheckValuesFromTable;
