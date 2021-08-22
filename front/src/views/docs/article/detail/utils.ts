import fetchApi from '@/api/fetchApi'
import moment from 'moment'

export const patchUpdateArticle = (
  articleID: string | number,
  data: object,
  callback: Function | null = null
) => {
  // 1. 文章URL
  const url = `/api/v1/docs/article/${articleID}`
  // console.log(articleID, data)
  const key = `article_${articleID}_content`

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
        if(localStorage.getItem(key)){
          localStorage.setItem(key, '')
        }
      } else {
        // 出错了
        console.log(responseData)
      }
    })
    .catch(err => {
      console.log(err)
      // 如果是更新文章内容出错了，把内容保存到本地
      if (data['content']) {
        const articleData = {
          content: data['content'],
          time: moment().format('YYYY-MM-DD hh:mm:ss'),
          key
        }
        // 保存内容
        localStorage.setItem(key, JSON.stringify(articleData))
      }

      if (typeof callback === 'function') {
        // 执行回调函数:把新的值传给callBack
        callback(err)
      }

    })
}
