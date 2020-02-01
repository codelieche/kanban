/**
 * 表格相关会用到的工具函数
 */

 import fetchApi from "./fetchApi";

 /**
 * 生成table的filters选项
 * 调用的时候记得bind(this)，哪个组件需要就绑定谁
 * 参数：
 * - filterOptionsName: 生成的filterOptions保存在state中的名字
 * - dataSourceStateField：filter的数据源在state中保存的字段
 * - fetchDataUrl: 获取数据源的url地址
 * - textField: filter的标题
 * - valueField: filter的值
 */
function generateTableFilterOptions(filterOptionsName, dataSourceStateField, fetchDataUrl, textField, valueField){
    // 1. 先判断状态值是否存在
    let dataSource = this.state[dataSourceStateField];
    if(dataSource === undefined){
        // 需要重新获取数据
        fetchApi.Get(fetchDataUrl)
          .then(data => {
              let updateState = {};
              let needUpdate = false;
              if(data instanceof Array){
                  updateState[dataSourceStateField] = data;
                  needUpdate = true;
              }else{
                  let results = data.results;
                  if(results instanceof Array){
                      updateState[dataSourceStateField] = results;
                      needUpdate = true;
                  }
              }
              
            // 修改状态
            if(needUpdate){
                this.setState(updateState, () => {
                    // 迭代，调用自己
                    generateTableFilterOptions.bind(this)(
                        filterOptionsName, dataSourceStateField, 
                        fetchDataUrl, textField, valueField
                    );
                });
            }
          })
            .catch(err => console.log(err));

    }else{
        // 开始处理filters
        let filterOptions = dataSource.map(item => {
            return {
                text: item[textField],
                value: item[valueField],
            }
        });
        let updateFields = {};
        updateFields[filterOptionsName] = filterOptions;
        this.setState(updateFields);
    }

}

export default generateTableFilterOptions;

export {
    generateTableFilterOptions
};