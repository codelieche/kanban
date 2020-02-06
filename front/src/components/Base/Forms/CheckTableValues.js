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
function CheckValuesFromTable(props){
    // checkValues, checkValuesState, dataSourceUrl, columns, rowKey="id", isMultiple=true, disabledKeys=[], showSubs=false
    // 保存api获取的数据的state
    // 第1个state：数据源的url
    const [url, urlState] = useState(null);

    // 相当于：componentDidMound，componentDidUpdate, componentWillUnMount
    useEffect(() => {
        // console.log(dataSourceUrl);
        if(props.dataSourceUrl !== url){
            // data["dataSourceUrl"] = dataSourceUrl;
            // 修改状态
            urlState(props.dataSourceUrl);
            // 获取数据
            fetchData(props.dataSourceUrl, 1);
        }
    }, [url, props.dataSourceUrl]);

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
        selectedRowKeys: props.checkValues ? props.checkValues : [],
        onChange: (selectedRowKeys) => {
            // console.log(selectedRowKeys);
            // checkValuesState(selectedRowKeys);
            props.checkValuesState(selectedRowKeys);
        },
        type: props.isMultiple ? "checkbox" : "radio",
        getCheckboxProps: record => ({
            disabled: function(){
                if(props.disabledKeys && props.disabledKeys instanceof Array){
                    for(var i=0; i < props.disabledKeys.length; i++){
                        if (record[props.rowKey] === props.disabledKeys[i]){
                            return true;
                        }
                    }
                }
                
                return false;
            }(),
            name: record[props.rowKey],
          }),
    }

    // onhandle
    function onChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
        let currentPage = pagination.current;
        fetchData(props.dataSourceUrl, currentPage);
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
                      rowKey={props.rowKey}
                      //   columns={columns.slice(0, 6)} 
                      size="small"
                      rowSelection={rowSelection}
                      columns={props.columns} 
                      pagination={false}
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
              title={() => props.checkValues.length > 0 ? `当前选中的值有：${JSON.stringify(props.checkValues)}` : null}
              columns={props.columns}
              dataSource={dataSource}
              pagination={pagination}
              onChange={onChange}
              rowKey={props.rowKey}
              rowSelection={rowSelection}
              bordered={true}
              expandable={props.showSubs ? expandable : undefined}
            >
            </Table>
        </div>
    );

}

export default CheckValuesFromTable;
