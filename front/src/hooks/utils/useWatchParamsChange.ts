import { watch } from 'vue'
import { Router } from 'vue-router'

export const useWatchParamsChange = (
  router: Router,
  fieldName: string,
  callback: Function
) => {
  // 监控路由的变化
  const routerMatched = router.currentRoute.value.matched
  watch([router.currentRoute], () => {
    const idValue = router.currentRoute.value.params[fieldName]
    // console.log(routerMatched, router.currentRoute.value.matched)
    // 如果不判断是否是同一个page，当跳转去其它页面的时候，当匹配到id也会去后台拉取数据
    let isSameRouter = false
    const newMatched = router.currentRoute.value.matched
    if (
      routerMatched[routerMatched.length - 1].path ===
      newMatched[newMatched.length - 1].path
    ) {
      isSameRouter = true
    }
    if (isSameRouter && idValue) {
      callback(idValue)
    }
  })
}

export default useWatchParamsChange
