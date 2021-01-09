// 通过发送ajax获取选项
// 传递的参数：[{field: 'id', valueField: 'id'}, {field: 'name', valueField: 'name'}]
import { ref, Ref } from 'vue'
import { useFetchListData } from './useFetchData'

interface ChoicesConfig {
  field: string;
  valueField: string; // 后续支持.号分割
}

/* eslint-disable */
const useFetchChoices = (
  url: Ref<string> | string,
  fields: Array<ChoicesConfig>,
  callback: Function | null = null,
) => {
//   console.log(url, fields)

  const choices: Ref<{
    [key: string]: any;
  }> = ref([])

  // 不优雅，后续还需调整
  const callbackFunc = (dataSource: Array<{ [key: string]: any }>) => {
    const choicesValue: Array<{ [key: string]: any }> = []
    dataSource.forEach(item => {
      // console.log(item)
      const itemChoice: { [key: string]: any } = {}
      if (typeof item === 'object') {
        fields.forEach(field => {
          if (item && item[field.valueField]) {
            itemChoice[field.field] = item[field.valueField]
          }
        })
        choicesValue.push(itemChoice)
        
      }
    })
    choices.value = choicesValue
    if(callback){
        callback(choicesValue)
    }
  }

  useFetchListData(url, ref(0), callbackFunc)

  return {
    choices
  }
}

export default useFetchChoices