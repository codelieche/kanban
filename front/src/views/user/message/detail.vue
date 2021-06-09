<template>
  <TopBar title="消息详情" />
  <Loading v-if="loading" />
  <div class="message" v-else-if="data && data.id > 0">
    <div className="header">
      <div className="title">
        <h2>{{ data.title }}</h2>
      </div>
      <div className="meta">
        <span>消息类型: {{ data.scope }}</span>
        <span>发送者: {{ data.sender }}</span>
        <span>时间: {{ data.time_added }}</span>
      </div>
    </div>

    <div className="body">
      {{ data.content }}
      <br />
      <router-link :to="data.link" v-if="data.link">{{
        data.link
      }}</router-link>
    </div>
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
export default defineComponent({
  name: 'UserMessageDetail',
  components: {
    Loading,
    TopBar
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

    // 组件挂载之后修改api的url
    onMounted(() => {
      const idVal = router.currentRoute.value.params['id']
      id.value = idVal as string

      if (idVal) {
        apiUrl.value = `/api/v1/account/message/${idVal}/`
      } else {
        console.log('ID为false：', idVal)
      }
    })

    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if (value && id.value !== value) {
        apiUrl.value = `/api/v1/account/message/${value}/`
        id.value = value
      }
    }
    useWatchParamsChange(router, 'id', handleParamsChange)

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

<style lang="less" scoped>
.message {
  margin: 10px 0;
  padding: 10px 20px;
  border: 1px solid #e1e6eb;

  .header {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #e1e6eb;
    // padding-bottom: 10px;

    h2 {
      font-size: 20px;
      line-height: 26px;
      margin: 21px 0 5px 0;
      // font-weight: 400;
      line-height: 1.1;
      // font-size: 18px;
      color: #555;
    }

    .meta {
      font-size: 13px;
      line-height: 22px;
      color: #999;
      span + span {
        display: inline-block;
        margin-left: 15px;
      }
    }
  }

  .body {
    padding: 20px 10px;
    min-height: 320px;
    font-size: 14px;
    line-height: 24px;
  }
}
</style>