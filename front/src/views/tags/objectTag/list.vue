<template>
  <TopBar title="对象标签列表" />
  <BaseTable
    apiUrlPrefix="/api/v1/tags/objecttag/list"
    pageUrlPrefix="/tags/objecttag/list"
    :paramsFields="[
      'page',
      'page_size',
      'ordering',
      'search',
      'tagvalue__tag_id',
      'tagvalue',
      'tagvalue__key_key',
      'model',
    ]"
    :reFreshTimes="reFreshTimes"
    :showHeader="true"
  >
    <template v-slot:default>
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
        sortable
      />
      <el-table-column
        prop="key"
        label="Key"
        width="100"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column prop="value" label="Value" width="120" align="center">
      </el-table-column>

      <el-table-column prop="app_label" label="App Label" width="120">
      </el-table-column>
      <el-table-column prop="model" label="Model" width="120">
      </el-table-column>
      <el-table-column prop="object_id" label="Object ID" width="120" />
      <el-table-column prop="user" label="添加者" width="120" />

      <!-- 状态 -->
      <el-table-column
        prop="is_deleted"
        label="状态"
        width="100"
        align="center"
      >
        <template #default="scope">
          <div class="status">
            <Icon :type="!scope.row.is_deleted ? 'check' : 'close'" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="">
        <template #default="scope">
          <span>
            <el-popconfirm
              :title="`确定删除(${scope.row.app_label}-${scope.row.model}-${scope.row.object_id})标签(${scope.row.key}-${scope.row.value})？`"
              confirmButtonText="确认"
              cancelButtonText="取消"
              cancelButtonType="default"
              @cancel="handleDeleteCancel"
              @confirm="handleDeleteConfirm(scope.row.id, `${scope.row.key}-${scope.row.value}`)"
            >
              <template #reference>
                <a>
                  <Icon type="trash-o" danger>删除</Icon>
                </a>
              </template>
            </el-popconfirm>
            <el-divider direction="vertical"></el-divider>
            对象信息
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
import { defineComponent, ref } from 'vue'
import BaseTable from '@/components/page/baseTable.vue'
import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import usePermissionCheck from '@/hooks/utils/usePermissionCheck'
import { ElMessage } from 'element-plus'
import fetchApi from '@/api/fetchApi'

export default defineComponent({
  name: 'UserGroupList',
  components: {
    BaseTable,
    Icon,
    TopBar,
  },
  setup() {
    // 设置顶部导航
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '对象标签',
        link: '/tags/objecttag',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 检查编辑权限
    const { havePermission } = usePermissionCheck('tags.change_value')

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // 删除确认事件
    const handleDeleteConfirm = (id: number, name: string): void => {
      if (!id || id < 0 || !havePermission.value) {
        return
      }
      // console.log('我将删除：', id, name)
      const url = `/api/v1/tags/objecttag/${id}`
      // 发起删除请求
      fetchApi
        .delete(url)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success(`删除标对象标签(${name}:${id})成功`)
            // 刷新数据
            reFreshData()
          } else {
            const result = response.data
            // console.log(result)
            if (result.message) {
              ElMessage.error(`删除失败: ${result.message}`)
            } else {
              ElMessage.error(`删除对象标签(${name}:${id})失败`)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(`删除对象标签(${name}:${id})失败`)
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
      reFreshTimes,
      havePermission,
      handleDeleteCancel,
      handleDeleteConfirm,
      reFreshData,
    }
  },
})
</script>