<template>
  <el-row :gutter="16">
    <!-- 左侧内容 -->
    <el-col :xs="24" :sm="16" :md="18">
      <TopBar title="分组详情" />

      <loading v-if="loading" />
      <div class="info-property" v-else-if="data && data.id > 0">
        <!-- <dl>
          <dt>ID</dt>
          <dd>{{ data.id }}</dd>
        </dl> -->
        <dl>
          <dt>名称</dt>
          <dd>{{ data.name }}</dd>
        </dl>

        <dl>
          <dt>Code</dt>
          <dd>{{ data.code }}</dd>
        </dl>

        <dl>
          <dt>父级分组</dt>
          <dd>
            <el-tag type="primary">{{
              data.level > 1 ? data.parent.name : '一级分组'
            }}</el-tag>
          </dd>
        </dl>

        <dl>
          <dt>所有者</dt>
          <dd>{{ data.owner }}</dd>
        </dl>
        <dl>
          <dt>用户</dt>
          <dd>
            <el-tag
              type="primary"
              size="small"
              v-for="(item, index) in data.users"
              :key="index"
            >
              {{ item }}</el-tag
            >
          </dd>
        </dl>

        <dl>
          <dt>描述</dt>
          <dd>{{ data.description }}</dd>
        </dl>
        <dl>
          <dt></dt>
          <dd>
            <img :src="data.image" v-if="data.image" />
          </dd>
        </dl>

        <dl>
          <dt>添加时间</dt>
          <dd>{{ data.time_added }}</dd>
        </dl>
        <dl>
          <dt>状态</dt>
          <dd><el-switch :value="!data.is_deleted" inactive-color="#fc5531"></el-switch></dd>
        </dl>
      </div>
    </el-col>

    <!-- 右侧内容 -->
    <el-col :xs="24" :sm="8" :md="6">
      <ModelLogs app="docs" model="group" :id="id" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import useWatchParamsChange from '@/hooks/utils/useWatchParamsChange'
import useFetchData from '@/hooks/utils/useFetchData'

// 引入所需组件
import Loading from '@/components/page/loading.vue'
import TopBar from '@/components/page/topBar.vue'
import ModelLogs from '@/components/page/modelLogs/index.vue'

export default defineComponent({
  name: 'DocsGroupDetail',
  components: { Loading, TopBar, ModelLogs },
  setup() {
    // 设置面包屑
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
        apiUrl.value = `/api/v1/docs/group/${idVal}`
      } else {
        console.log('ID为false：', idVal)
      }
    })

    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if (value && id.value !== value) {
        apiUrl.value = `/api/v1/docs/group/${value}`
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