/**
 * 当文章内容变化的时候，需要的操作
 * 1. 判断全局的文章分组是否需要变化
 */

import {
  globalGroup,
  setGlobalGroup,
  activeArticeIDs
} from '@/hooks/store/useArticleLeftSiderData'
import { useFetchDataOneTimes } from '@/hooks/utils/useFetchData'
import { NavBreadcrumbItem } from '@/types/base/nav'
import { breadcrumbItems } from '@/hooks/store/useBreadcrumbItems'

// 检查全局的文章分组是否变更了
export const updateGlobalGroup = (data: object) => {
  if (data) {
    if (
      !globalGroup.value ||
      (data['group'] && data['group'] != globalGroup.value['id'])
    ) {
      const url = `/api/v1/docs/group/${data['group']}`
      //   console.log('需要设置全局的分组', url)
      const callback = (obj: object) => {
        if (obj && obj['id'] > 0) {
          setGlobalGroup(obj)
        }
      }
      useFetchDataOneTimes(url, null, callback)
    }
  }
}

// 修改左侧激活的文章选项
export const updateLeftSiderActiveItems = (data: object) => {
  //   console.log(data)
  const newActiveArticeIDs: Array<number> = []
  let parent = data['parent']
  while(parent && parent['id'] > 0){
      newActiveArticeIDs.push(parent['id'])
      parent = parent['parent']
  }
  // 当前激活的选项为
  activeArticeIDs.value = newActiveArticeIDs
}

// 修改文章导航
export const updateHeaderNavData = (data: object) => {
    if(!(data && data['id'] > 0)){
        return
    }
    // 更新导航
    const newNavData: Array<NavBreadcrumbItem> = [
        {
            title: data['title'],
            icon: data['icon'],
        }
    ]
    let parent = data['parent']
    while( parent && parent['id'] > 0){
        const navItem = {
            title: parent['title'] ? parent['title'] : '无标题',
            link: `/docs/article/${parent['id']}`,
            icon: parent['icon'],
            id: parent['id']
        }
        newNavData.unshift(navItem)
        parent = parent['parent']
    }
    // 记得加入首页
    newNavData.unshift({
        // title: globalGroup.value['name'],
        title: '首页',
        icon: 'home',
        link: '/',
    })

    breadcrumbItems.value = newNavData
}
