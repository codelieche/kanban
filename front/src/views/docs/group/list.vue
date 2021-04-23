<template>
  <TopBar title="分组列表" />

  <BaseTable
    apiUrlPrefix="/api/v1/docs/group/list"
    pageUrlPrefix="/docs/group/list"
    :reFreshTimes="reFreshTimes"
    :showHeader="true"
    :rowKey="rowKey"
    :props="tableProps"
    :paramsFields="['page', 'page_size', 'ordering', 'search', 'level']"
  >
    <template v-slot:default>
      <!-- <el-table-column
      type="selection"
      width="50" /> -->

      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column prop="name" label="分组组" width="120">
      </el-table-column>
      <el-table-column prop="code" label="代码" width="120" />

      <el-table-column prop="parent" label="父级分组" width="115" align="center">
        <template #default="scope">
          <div class="status">
            <el-tag type="primary" size="small">{{
              scope && scope.row && scope.row.level > 1 && scope.row.parent
                ? scope.row.parent.name
                : '一级分组'
            }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="owner" label="所有者" width="100" />

      <el-table-column prop="description" label="描述" width="" align="center"/>
      <!-- 状态 -->
      <el-table-column
        prop="is_deleteed"
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

      <!-- <el-table-column
        prop="time_added"
        label="添加时间"
        width="170"
        align="center"
        sortable
      /> -->

      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <!-- 有编辑Group权限的用户可看到的按钮 -->
          <span v-if="havePermission">
            <router-link
              :to="`/docs/group/${scope.row.id}`"
              v-if="scope.row.id > 0"
            >
              <Icon type="link">详情</Icon>
            </router-link>
            <el-divider direction="vertical"></el-divider>
            <router-link
              :to="`/docs/group/${scope.row.id}/editor`"
              v-if="scope.row.id > 0"
            >
              <Icon type="edit">编辑</Icon>
            </router-link>
            <el-divider direction="vertical"></el-divider>

            <el-popconfirm
              :title="`确定删除: ${scope.row.name}(id: ${scope.row.id})？`"
              confirmButtonText="确认"
              cancelButtonText="取消"
              cancelButtonType="default"
              @cancel="handleDeleteCancel"
              @confirm="handleDeleteConfirm(scope.row.id, scope.row.name)"
            >
              <template #reference>
                <el-button
                  type="text"
                  :disabled="scope.row.is_deleted ? true : false"
                >
                  <Icon
                    type="trash-o"
                    :danger="!scope.row.is_deleted ? true : false"
                    >删除</Icon
                  >
                </el-button>
              </template>
            </el-popconfirm>
          </span>

          <!-- 没权限编辑的用户只看到查看详情 -->
          <router-link
            :to="`/docs/group/${scope.row.id}`"
            v-else-if="scope.row.id > 0"
          >
            <Icon type="link"> 查看详情 </Icon>
          </router-link>
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

        <router-link
          :to="`/docs/group/list?page=1&level=${!showTopGroup ? '' : '1'}`"
        >
          <el-button
            type="primary"
            @click="handleShowTopGroupToogle"
            size="small"
          >
            <Icon type="filter">{{
              !showTopGroup ? '一级分组' : '显示全部'
            }}</Icon>
          </el-button>
        </router-link>

        <router-link to="/docs/group/add">
          <el-button type="primary" size="small">
            <Icon type="plus">Add</Icon>
          </el-button>
        </router-link>
      </el-col>
    </template>
  </BaseTable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import BaseTable from '@/components/page/baseTable.vue'
import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import usePermissionCheck from '@/hooks/utils/usePermissionCheck'
import { ElMessage } from 'element-plus'
import fetchApi from '@/plugins/fetchApi'
import { useRouter } from 'vue-router'

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
        title: '文档分组',
        link: '/docs/group',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 检查编辑权限
    const { havePermission } = usePermissionCheck('account.change_group')

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // 给数据传递的参数：
    // const urlParams = ref({ level: '' })
    // 是否显示一级分组
    const showTopGroup = ref(false)
    const rowKey = ref('')

    // 路由
    const router = useRouter()

    onMounted(() => {
      // console.log(router.currentRoute.value.query)
      if (router.currentRoute.value.query['level'] === '1') {
        showTopGroup.value = true
        // urlParams.value['level'] = '1'
        rowKey.value = 'id'
      }
    })

    // 删除确认事件
    const handleDeleteConfirm = (id: number, name: string): void => {
      if (!id || id < 0 || !havePermission.value) {
        return
      }
      // console.log('我将删除：', id, name)
      const url = `/api/v1/docs/group/${id}`
      // 发起删除请求
      fetchApi
        .delete(url)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success(`删除分组(${name}:${id})成功`)
            // 刷新数据
            reFreshData()
          } else {
            const result = response.data
            // console.log(result)
            if (result.message) {
              ElMessage.error(`删除失败: ${result.message}`)
            } else {
              ElMessage.error(`删除分组(${name}:${id})失败`)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(`删除分组(${name}:${id})失败`)
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

    // 表格的选项
    const tableProps = ref({
      // 'row-key': 'id',
      'default-expand-all': false,
      'tree-props': { children: 'children', hasChildren: 'hasChildren' },
    })

    // 修改显示一级分组
    const handleShowTopGroupToogle = () => {
      showTopGroup.value = !showTopGroup.value
      if (showTopGroup.value) {
        // urlParams.value['level'] = '1'
        // urlParams.value['page'] = '1'
        rowKey.value = 'id'
      } else {
        // urlParams.value['level'] = ''
        rowKey.value = ''
      }
    }

    return {
      rowKey,
      showTopGroup,
      // urlParams,
      handleShowTopGroupToogle,
      tableProps,
      reFreshTimes,
      havePermission,
      handleDeleteCancel,
      handleDeleteConfirm,
      reFreshData,
    }
  },
})
</script>