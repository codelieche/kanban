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
  haveChildren: Boolean = false,
  childrenField: string = "children",
) => {
  //   console.log(url, fields)

  const choices: Ref<{
    [key: string]: any
  }> = ref([])

  // 从item中提取需要的值
  const getChoiceItem = (item: any) => {
    const itemChoice: { [key: string]: any } = {}
    if (typeof item === 'object') {
      fields.forEach(field => {
        if (item && item[field.valueField]) {
          itemChoice[field.field] = item[field.valueField]
        }
      })

      // 有子元素，而且子元素是个数组
      if ( haveChildren && Array.isArray(item[childrenField])){
        // console.log(item[childrenField])
        if(item[childrenField].length > 0){
          itemChoice[childrenField] = []
          item[childrenField].forEach((subItem:any) => {
            itemChoice[childrenField].push(getChoiceItem(subItem))
          });
        }
      }

      // 返回处理完的选项
      return itemChoice
    }else{
      // 不是object的数据，那么一般就是number/string咯
      fields.forEach(field => {
        if (item) {
          itemChoice[field.field] = item
        }
      })
      return itemChoice
      // return null
    }
    
  }
  // console.log(getChoiceItem)

  // 不优雅，后续还需调整
  const callbackFunc = (dataSource: Array<{ [key: string]: any }>) => {
    const choicesValue: Array<{ [key: string]: any }> = []
    dataSource.forEach(item => {
      // console.log(item)

      // 取出列表中没一项的选项值
      const itemChoice: { [key: string]: any } | null = getChoiceItem(item)
      if (itemChoice !== null) {
        fields.forEach(field => {
          if (item && item[field.valueField]) {
            itemChoice[field.field] = item[field.valueField]
          }
        })
        choicesValue.push(itemChoice)
      }
    })

    // 遍历处理完毕，对choices赋值
    choices.value = choicesValue
    if (callback) {
      callback(choicesValue)
    }
  }

  useFetchListData(url, ref(0), callbackFunc)

  return {
    choices
  }
}

export default useFetchChoices
