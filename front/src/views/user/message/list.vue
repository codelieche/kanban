<template>
  <TopBar title="消息列表" />
  <BaseTable
    apiUrlPrefix="/api/v1/account/message/"
    :pageUrlPrefix="`/user/message/${type}`"
    :paramsFields="['page', 'page_size', 'ordering', 'search', 'unread']"
    :reFreshTimes="reFreshTimes"
    :showHeader="true"
  >
    <template v-slot:default>
      <el-table-column prop="id" label="ID" width="80" align="center" sortable>
      </el-table-column>
      <!-- <el-table-column prop="user" label="用户" width="100" align="center" sortable /> -->
      <el-table-column prop="title" label="标题" width="200">
        <template #default="scope">
          <router-link
            :to="`/user/message/${scope.row.id}`"
            v-if="scope.row.id > 0"
          >
            <el-badge
              is-dot
              class="small"
              :style="{ visibility: scope.row.unread ? 'visible' : 'hidden'}"
            ></el-badge>
            {{ scope.row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="time_added" label="时间" align="center" width="180" sortable />
      <el-table-column prop="sender" label="发送者" width="100" align="center" sortable />
      <el-table-column
        prop="scope"
        label="消息分类"
        align="center"
        width="90"
      />
      <el-table-column prop="unread" label="已读" align="center" width="80">
        <template #default="scope">
          <div class="status">
            <Icon :type="scope.row.unread ? 'close' : 'check'" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="left" width="">
        <template #default="scope">
          <span>
            <router-link
              :to="`/user/message/${scope.row.id}`"
              v-if="scope.row.id > 0"
            >
              <el-button type="text">
                <Icon type="link">详情</Icon>
              </el-button>
            </router-link>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm
              :title="`确定删除消息：(id: ${scope.row.id})？`"
              confirmButtonText="确认"
              cancelButtonText="取消"
              cancelButtonType="default"
              @cancel="handleDeleteCancel"
              @confirm="handleDeleteConfirm(scope.row.id, scope.row.title)"
            >
              <template #reference>
                <el-button type="text">
                  <Icon type="trash-o" danger>删除</Icon>
                </el-button>
              </template>
            </el-popconfirm>
          </span>
        </template>
      </el-table-column>
    </template>

    <!-- 右侧按钮区域 -->
    <template v-slot:rightButtons>
      <!-- 右侧的添加/刷新按钮 -->
      <el-col
        :sm="12"
        :xs="24"
        :style="{ 'text-align': 'right' }"
        class="right"
      >
        <el-button type="default" @click="reFreshData" size="small">
          <Icon type="refresh">刷新</Icon>
        </el-button>
      </el-col>
    </template>
  </BaseTable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import { useWatchParamsChange } from '@/hooks/utils/useWatchParamsChange'
import BaseTable from '@/components/page/baseTable.vue'
import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import { ElMessage } from 'element-plus'
import fetchApi from '@/plugins/fetchApi'

export default defineComponent({
  name: 'UserGroupDetail',
  components: {
    BaseTable,
    Icon,
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
    const type = ref<string>('')
    const apiUrl = ref<string | null>(null)

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // 组件挂载之后修改api的url
    onMounted(() => {
      const typeVal = router.currentRoute.value.params['type']
      type.value = typeVal as string

      if (typeVal) {
        apiUrl.value = `/api/v1/account/message/?type=${typeVal}`
      } else {
        console.log('ID为false：', typeVal)
      }
    })

    // const apiUrlSuffix = ref('')

    // 监控路由的变化
    const handleParamsChange = (value: string) => {
      if (value && type.value !== value) {
        type.value = value
        // if(value === 'unread'){
        //     apiUrlSuffix.value = 'unread=true'
        // }else if(value === 'read'){
        //     apiUrlSuffix.value = 'unread=false'
        // }else{
        //     apiUrlSuffix.value = ''
        // }
        reFreshData()
      }
    }
    useWatchParamsChange(router, 'type', handleParamsChange)

    // 删除确认事件
    const handleDeleteConfirm = (id: number, title: string): void => {
      if (!id || id < 0) {
        return
      }
      // console.log('我将删除：', id, name)
      const url = `/api/v1/account/message/${id}/`
      // 发起删除请求
      fetchApi
        .delete(url)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success(`删除消息(${title}:${id})成功`)
            // 刷新数据
            reFreshData()
          } else {
            const result = response.data
            // console.log(result)
            if (result.message) {
              ElMessage.error(`删除失败: ${result.message}`)
            } else {
              ElMessage.error(`删除消息(${title}:${id})失败`)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(`删除消息(${title}:${id})失败`)
        })
    }
    // 取消删除
    const handleDeleteCancel = (): void => {
      // ElMessage.warning("取消哦删除")
      ElMessage({
        message: '取消删除',
        type: 'warning',
        center: true,
      })
    }

    return {
      type,
      reFreshTimes,
      reFreshData,
      handleDeleteConfirm,
      handleDeleteCancel,
    }
  },
})
</script>