<template>
  <div class="main">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="16">
        <TopBar title="分组详情" />
        <!-- 左侧内容 -->
        <!-- Loading的时候显示加载中 -->
        <Loading v-if="loading" />
        <div class="info-property" v-else-if="data && data.id > 0">
          <dl>
            <dt>ID</dt>
            <dd>{{ data.id }}</dd>
          </dl>
          <dl>
            <dt>名称</dt>
            <dd>{{ data.name }}</dd>
          </dl>
          <dl>
            <dt>所有用户</dt>
            <dd>
              <el-tag
                v-for="(item, index) in data.user_set"
                :key="index"
                size="small"
              >
                {{ item }}
              </el-tag>
            </dd>
          </dl>
          <dl>
            <dt>所有权限</dt>
            <dd>
              <el-tag
                v-for="(item, index) in data.permissions"
                :key="index"
                size="small"
                type="info"
              >
                {{ item.app_model }}
                <el-divider direction="vertical"></el-divider>
                {{ item.codename }}
              </el-tag>
            </dd>
          </dl>
        </div>

        <div class="test">
          <el-divider></el-divider>
          <div>
            <div v-for="item in [1, 2, 3, 4, 5, 6]" :key="item">
              <router-link :to="`/user/group/${item}`">
                {{ `/user/group/${item}` }}
              </router-link>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="8">
        <ModelLogs app="auth" model="group" :id="id" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import { useFetchData } from '@/hooks/utils/useFetchData'
import { useWatchParamsChange } from '@/hooks/utils/useWatchParamsChange'
import Loading from '@/components/page/loading.vue'
import TopBar from '@/components/page/topBar.vue'
import ModelLogs from '@/components/page/modelLogs/index.vue'
export default defineComponent({
  name: 'UserGroupDetail',
  components: {
    Loading,
    ModelLogs,
    TopBar,
  },
  setup() {
    // 设置面包屑导航
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '用户分组',
        link: '/user/group',
      },
      {
        title: '详情',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
    // 获取路由中的参数
    const router = useRouter()
    const id = ref<string>('')
    const apiUrl = ref<string | null>(null)
    // 获取详情数据
    const { loading, data, error } = useFetchData(apiUrl, router)
    // console.log(router)
    // console.log(router.currentRoute.value.params)

    // 组件挂载之后修改api的url
    onMounted(() => {
      const idVal = router.currentRoute.value.params['id']
      id.value = idVal as string

      if (idVal) {
        apiUrl.value = `/api/v1/account/group/${idVal}`
      } else {
        console.log('ID为false：', idVal)
      }
    })

    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if (value && id.value !== value) {
        apiUrl.value = `/api/v1/account/group/${value}`
        id.value = value
      }
    }
    useWatchParamsChange(router, 'id', handleParamsChange)

    // 监控路由的变化
    // const routerMatched = router.currentRoute.value.matched
    // watch([router.currentRoute], () => {
    //   const idValue = router.currentRoute.value.params['id']
    //   // console.log(routerMatched, router.currentRoute.value.matched)
    //   // 如果不判断是否是同一个page，当跳转去其它页面的时候，当匹配到id也会去后台拉取数据
    //   let isSameRouter = false
    //   const newMatched = router.currentRoute.value.matched
    //   if (
    //     routerMatched[routerMatched.length - 1].path ===
    //     newMatched[newMatched.length - 1].path
    //   ) {
    //     isSameRouter = true
    //   }
    //   if (
    //     isSameRouter &&
    //     idValue &&
    //     apiUrl.value !== `/api/v1/account/group/${idValue}`
    //   ) {
    //     apiUrl.value = `/api/v1/account/group/${idValue}`
    //     id.value = idValue as string
    //   }
    // })

    return {
      id,
      loading,
      data,
      apiUrl,
      error,
    }
  },
})
</script>