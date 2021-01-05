// 发起ajax从后台获取数据
import { onMounted, ref, Ref, watch } from 'vue'
import { AxiosResponse } from 'axios'
import fetchApi from '@/plugins/fetchApi'

// 传入url，发起ajax请求获取数据
// url可以是字符类型，或者Ref<string>类型，当传递的是Ref类型的时候，会监控url的变化
// 比如我们点击了下一页，page变更了，这样就需要重新发起ajax获取数据
export const useFetchData = <T>(url: Ref<string> | string, successCode = 200) => {
  const loading = ref<boolean>(true)
  const error = ref<boolean>(false)
  const data = ref<T | null>(null)

  const fetchData = (url: string) => {
    fetchApi
      .get(url)
      .then((response: AxiosResponse) => {
        if (response.status == successCode) {
          // console.log(response.data)
          data.value = response.data
        }
        loading.value = false
        //   console.log(response)
      })
      .catch(err => {
        console.log(err)
        loading.value = true
        error.value = true
      })
  }
  
  onMounted(() => {
    // console.log('即将发起ajax请求：', url, typeof url)
    if (typeof url === 'object') {
        watch(url, () => {
          if (url.value) {
            fetchData(url.value)
          }
        }, {immediate: true})
      }else{
        fetchData(url)
      }
  })

  return {
    loading,
    // error
    data
  }
}

export const useFetchListData = <T>(url: Ref<string> | string, successCode = 200) => {
  const loading = ref<boolean>(true)
  const error = ref<boolean>(false)
  const dataSource = ref<Array<T> | null>(null)
  const count = ref<number>(0)

  const fetchData = (url: string) => {
    fetchApi
      .get(url)
      .then((response: AxiosResponse) => {
        if (response.status == successCode) {
          // console.log(response.data)
          const data = response.data
          if (Array.isArray(data) ){
            dataSource.value = data
          } else {
            if (Number.isInteger(data.count)) {
              count.value = data.count
            }
            if (Array.isArray(data.results)) {
              dataSource.value = data.results
            }
          }
        }
        loading.value = false
        //   console.log(response)
      })
      .catch(err => {
        console.log(err)
        loading.value = true
        error.value = true
      })
  }
  
  onMounted(() => {
    // console.log('即将发起ajax请求：', url, typeof url)
    if (typeof url === 'object') {
        watch(url, () => {
          if (url.value) {
            fetchData(url.value)
          }
        }, {immediate: true})
      }else{
        fetchData(url)
      }
  })

  return {
    loading,
    // error
    dataSource,
    count
  }
}

export default useFetchData
