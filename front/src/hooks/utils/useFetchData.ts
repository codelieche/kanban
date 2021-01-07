// 发起ajax从后台获取数据
import { onBeforeUnmount, onMounted, ref, Ref, watch } from 'vue'
import { Router } from 'vue-router'
import { AxiosResponse } from 'axios'
import fetchApi from '@/plugins/fetchApi'

// 传入url，发起ajax请求获取数据
// url可以是字符类型，或者Ref<string>类型，当传递的是Ref类型的时候，会监控url的变化
// 比如我们点击了下一页，page变更了，这样就需要重新发起ajax获取数据
export const useFetchData = <T>(
  url: Ref<string | null> | string,
  router: Router | null = null,
  successCode = 200
) => {
  const loading = ref<boolean>(true)
  const error = ref<AxiosResponse | null>(null)
  const data = ref<T | null>(null)

  const fetchData = (url: string) => {
    loading.value = true
    fetchApi
      .get(url)
      .then((response: AxiosResponse) => {
        if (response.status == successCode) {
          // console.log(response.data)
          data.value = response.data
          if (error.value) {
            error.value = null
          }
        }
        loading.value = false
        //   console.log(response)
      })
      .catch(err => {
        // console.log(err)
        loading.value = false
        error.value = err
        data.value = null

        // 是否跳转错误页
        if (router) {
          if (err.status == 403) {
            router.replace('/errors/403')
          } else if (err.status == 404) {
            router.replace('/errors/404')
          } else if (err.status >= 500) {
            router.replace('/errors/500')
          } else {
            console.log('我将跳转错误页')
          }
        }
      })
  }

  onMounted(() => {
    // console.log('即将发起ajax请求：', url, typeof url)
    if (typeof url === 'object') {
      watch(
        url,
        () => {
          if (url.value) {
            fetchData(url.value)
          }
        },
        { immediate: true }
      )
    } else {
      fetchData(url)
    }
  })

  onBeforeUnmount(() => {
    if (typeof url === 'object') {
      url.value = ''
    }
  })

  return {
    loading,
    error,
    data
  }
}

export const useFetchListData = <T>(
  url: Ref<string> | string,
  reFreshTimes: Ref<number> = ref(0),
  callback?: Function,
  successCode = 200
) => {
  const loading = ref<boolean>(true)
  const error = ref<boolean>(false)
  const dataSource = ref<Array<T> | null>(null)
  const count = ref<number>(0)
  const next = ref<string | null>(null)

  const fetchData = (url: string) => {
    fetchApi
      .get(url)
      .then((response: AxiosResponse) => {
        if (response.status == successCode) {
          // console.log(response.data)
          const data = response.data
          if (Array.isArray(data)) {
            dataSource.value = data
            if (callback) {
              callback(data)
            }
            next.value = null
          } else {
            if (Number.isInteger(data.count)) {
              count.value = data.count
            }
            if (Array.isArray(data.results)) {
              dataSource.value = data.results
              if (callback) {
                callback(data.results)
              }
            }
            if (data.next) {
              next.value = data.next
            } else {
              next.value = null
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
        next.value = null
      })
  }

  onMounted(() => {
    // console.log('即将发起ajax请求：', url, typeof url)
    if (typeof url === 'object') {
      watch(
        [url, reFreshTimes],
        () => {
          if (url.value) {
            fetchData(url.value)
          }
        },
        { immediate: true }
      )
    } else {
      fetchData(url)
    }
  })

  return {
    loading,
    // error
    dataSource,
    count,
    next
  }
}

export default useFetchData
