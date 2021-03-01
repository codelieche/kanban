<template>
  <TopBar title="对象列表" />
  <div :style="{ 'min-height': '90vh' }">
    <BaseList
      apiUrlPrefix="/api/v1/storage/file/list"
      pageUrlPrefix="/storage/object/list"
      :pageSize="20"
      :reFreshTimes="reFreshTimes"
      :paramsFields="[
        'search',
        'page',
        'page_size',
        'ordering',
        'tag__keys',
        'tag__values',
      ]"
    >
      <!-- 列表主要内容 -->
      <template v-slot:default="data">
        <!-- 用ColumnWrap包裹 -->
        <ColumnWrap class="objects-list" :width="270">
          <ObjectItem
            v-for="(item, index) in data.dataSource"
            :key="`${item.id}-${index}`"
            :data="item"
            @click="handleObjectClick(item)"
          >
          </ObjectItem>
        </ColumnWrap>
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
          <!-- 过滤按钮 -->
          <ObjectTagFilterButton pageUrlPrefix="/storage/object/list" />
          <el-button type="default" @click="reFreshData" size="small">
            <Icon type="refresh">刷新</Icon>
          </el-button>

          <UploadObjectButton :reFreshData="reFreshData" />
        </el-col>
      </template>
    </BaseList>
  </div>

  <!-- 图片弹出框 -->
  <ObjectDialog
    :visible="showObjectDialog"
    :data="currentObject"
    :reFreshData="reFreshData"
    :afterCloseHandle="afterCloseHandle"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'

import fetchApi from '@/plugins/fetchApi'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import usePermissionCheck from '@/hooks/utils/usePermissionCheck'

import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import BaseList from '@/components/page/baseList.vue'
import ColumnWrap from '@/components/page/base/columnWrap.vue'
import ObjectTagFilterButton from '@/components/page/objectTag/filterButton.vue'
import ObjectItem from './listItem.vue'
import ObjectDialog from './objectDialog.vue'
import UploadObjectButton from './upload.vue'

export default defineComponent({
  name: 'ObjectListPage',
  components: {
    Icon,
    TopBar,
    BaseList,
    ColumnWrap,
    ObjectTagFilterButton,
    ObjectItem,
    ObjectDialog,
    UploadObjectButton,
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
        title: '对象存储',
        link: '/storage/object',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 检查编辑权限
    const { havePermission } = usePermissionCheck('storage.change_object')

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // 弹出对象对话框
    const showObjectDialog = ref(false)
    const currentObject = ref({})
    const afterCloseHandle = () => {
      showObjectDialog.value = false
      currentObject.value = {}
    }

    // 点击对象
    const handleObjectClick = (data: object) => {
      //   console.dir(data)
      showObjectDialog.value = true
      currentObject.value = data
    }

    // 删除确认事件
    const handleDeleteConfirm = (id: number, name: string): void => {
      if (!id || id < 0 || !havePermission.value) {
        return
      }
      // console.log('我将删除：', id, name)
      const url = `/api/v1/storage/object/${id}`
      // 发起删除请求
      fetchApi
        .delete(url)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success(`删除对象(${name}:${id})成功`)
            // 刷新数据
            reFreshData()
          } else {
            const result = response.data
            // console.log(result)
            if (result.message) {
              ElMessage.error(`删除失败: ${result.message}`)
            } else {
              ElMessage.error(`删除对象(${name}:${id})失败`)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(`删除对象(${name}:${id})失败`)
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
      havePermission,
      reFreshTimes,
      reFreshData,
      currentObject, // 当前对象数据
      showObjectDialog, // 显示对象对话框
      afterCloseHandle,
      handleObjectClick, // 对象点击的时候触发
      handleDeleteConfirm,
      handleDeleteCancel,
    }
  },
})
</script>