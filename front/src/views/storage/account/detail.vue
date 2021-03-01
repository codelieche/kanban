<template>
  <el-row :gutter="16">
    <!-- 左侧内容 -->
    <el-col :xs="24" :sm="16" :md="18">
      <TopBar title="账号详情" />

      <Loading v-if="loading" />
      <div class="info-property" v-else-if="data && data.id > 0">
        <dl>
          <dt>ID</dt>
          <dd>{{ data.id }}</dd>
        </dl>
        <dl>
          <dt>平台</dt>
          <dd>{{ data.platform }}</dd>
        </dl>
        <dl>
          <dt>用户</dt>
          <dd>{{ data.user }}</dd>
        </dl>
        <dl>
          <dt>账号</dt>
          <dd>{{ data.account }}</dd>
        </dl>
        <dl>
          <dt>Bucket</dt>
          <dd>{{ data.bucket }}</dd>
        </dl>
        <dl>
          <dt>Access Key</dt>
          <dd>{{ data.access_key }}</dd>
        </dl>
        <!-- <dl>
          <dt>Secret Key</dt>
          <dd>{{ data.secret_key }}</dd>
        </dl> -->
        <dl>
          <dt>Domain</dt>
          <dd>{{ data.domain }}</dd>
        </dl>
        <dl>
          <dt>是否HTTPS</dt>
          <dd>
            <el-switch
              :value="data.is_https"
              inactive-color="#eee"
            ></el-switch>
          </dd>
        </dl>
        <dl>
          <dt>是否默认</dt>
          <dd>
            <el-switch
              :value="data.is_default"
              inactive-color="#eee"
            ></el-switch>
          </dd>
        </dl>
        <dl>
          <dt>状态</dt>
          <dd>
            <el-switch
              :value="data.is_active"
              inactive-color="#fc5531"
            ></el-switch>
          </dd>
        </dl>
        <dl>
          <dt>添加时间</dt>
          <dd>{{ data.time_added }}</dd>
        </dl>
        <dl>
          <dt>修改时间</dt>
          <dd>{{ data.time_updated }}</dd>
        </dl>
        <dl>
          <dt>描述</dt>
          <dd>{{ data.description }}</dd>
        </dl>
      </div>
    </el-col>

    <!-- 右侧内容 -->
    <el-col :xs="24" :sm="8" :md="6">
      <ModelLogs app="storage" model="account" :id="id" />
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import useFetchData from '@/hooks/utils/useFetchData'
import useWatchParamsChange from '@/hooks/utils/useWatchParamsChange'

import TopBar from '@/components/page/topBar.vue'
import Loading from '@/components/page/loading.vue'
import ModelLogs from '@/components/page/modelLogs/index.vue'

export default defineComponent({
  name: 'AccountDetail',
  components: {
    TopBar,
    Loading,
    ModelLogs,
  },
  setup() {
    // 设置面包屑
    // 设置面包屑
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '存储账号',
        link: '/storage/account',
      },
      {
        title: '详情',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 获取路由中的参数
    const router = useRouter()
    const id = ref('')
    const apiUrl = ref<string | null>(null)
    const reFreshTimes = ref(0)
    // 获取详情数据
    const { loading, data, error } = useFetchData(apiUrl, router, reFreshTimes)

    // 组件挂载之后修改api的url
    onMounted(() => {
      const idVal = router.currentRoute.value.params['id']
      id.value = idVal as string

      if (idVal) {
        apiUrl.value = `/api/v1/storage/account/${idVal}/`
      } else {
        console.log('ID为false：', idVal)
      }
    })
    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if (value && id.value !== value) {
        apiUrl.value = `/api/v1/storage/account/${value}/`
        id.value = value
      }
    }
    useWatchParamsChange(router, 'id', handleParamsChange)

    return {
      id,
      loading,
      data,
      error,
    }
  },
})
</script>