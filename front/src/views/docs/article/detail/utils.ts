import fetchApi from '@/plugins/fetchApi'

export const patchUpdateArticle = (
  articleID: string | number,
  data: object,
  callback: Function
) => {
  // 1. 文章URL
  const url = `/api/v1/docs/article/${articleID}`
  //   console.log(articleID, data)

  // 2. 发起请求
  fetchApi
    .patch(url, data)
    .then(response => response.data)
    .then(responseData => {
      if (responseData && responseData.id > 0) {
        // 如果成功了，需要执行callback
        if (typeof callback === 'function') {
          // 执行回调函数:把新的值传给callBack
          callback(responseData)
        }
      } else {
        // 出错了
        console.log(responseData)
      }
    })
    .catch(err => {
      console.log(err)
    })
}
