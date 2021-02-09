<template>
  <TopBar title="图片列表" />
  <div :style="{ 'min-height': '90vh' }">
    <BaseList
      apiUrlPrefix="/api/v1/docs/image/list"
      pageUrlPrefix="/docs/image/list"
      :pageSize="20"
      :reFreshTimes="reFreshTimes"
    >
      <template v-slot:default="data">
        <div
          class="images-list"
          :style="{ columnCount: imagesColumnNumber }"
          ref="listRef"
        >
          <ImageItem
            v-for="(item, index) in data.dataSource"
            :key="index"
            :data="item"
            @click="handleImageClick(item)"
          />
        </div>
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

          <UploadImageButton :reFreshData="reFreshData"/>
          <!-- <router-link to="/docs/image/list">
            <el-button type="primary" size="small">
              <Icon type="upload">Add</Icon>
            </el-button>
          </router-link> -->
        </el-col>
      </template>
    </BaseList>
  </div>

  <!-- 图片弹出框 -->
  <ImageDialog
    :visible="showImageDialog"
    :data="currentImage"
    :reFreshData="reFreshData"
    :afterCloseHandle="afterCloseHandle"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from 'vue'

import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import usePermissionCheck from '@/hooks/utils/usePermissionCheck'
import { ElMessage } from 'element-plus'
import fetchApi from '@/plugins/fetchApi'
import BaseList from '@/components/page/baseList.vue'
import ImageItem from './listItem.vue'
import ImageDialog from './imageDialog.vue'
import UploadImageButton from './upload.vue'

export default defineComponent({
  name: 'UserGroupList',
  components: {
    BaseList,
    ImageItem,
    ImageDialog,
    UploadImageButton,
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
        title: '文档图片',
        link: '/docs/image',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 列表div的Ref
    const listRef: Ref<HTMLElement | null> = ref(null)
    const imagesColumnNumber = ref(1)

    // 计算列数
    const calculateImagesColumnNumber = () => {
      if (listRef.value) {
        const column = Math.ceil((listRef.value.clientWidth - 60) / 270)
        imagesColumnNumber.value = column > 1 ? column : 1
      }
    }
    // 监控listRef的变化
    watch([listRef], () => {
      if (listRef.value) {
        calculateImagesColumnNumber()
      }
    })
    onMounted(() => {
      window.onresize = calculateImagesColumnNumber
    })

    // 检查编辑权限
    const { havePermission } = usePermissionCheck('docs.change_image')

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // const urlParams = ref({ level: '' })

    // 路由
    // const router = useRouter()

    // onMounted(() => {
    //   console.log(router)
    // })

    // 弹出图片对话框
    const showImageDialog = ref(false)
    const currentImage = ref({})
    const afterCloseHandle = () => {
      showImageDialog.value = false
      currentImage.value = {}
    }
    const handleImageClick = (data: object) => {
      //   console.dir(data)
      showImageDialog.value = true
      currentImage.value = data
    }

    // 删除确认事件
    const handleDeleteConfirm = (id: number, name: string): void => {
      if (!id || id < 0 || !havePermission.value) {
        return
      }
      // console.log('我将删除：', id, name)
      const url = `/api/v1/docs/image/${id}`
      // 发起删除请求
      fetchApi
        .delete(url)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success(`删除图片(${name}:${id})成功`)
            // 刷新数据
            reFreshData()
          } else {
            const result = response.data
            // console.log(result)
            if (result.message) {
              ElMessage.error(`删除失败: ${result.message}`)
            } else {
              ElMessage.error(`删除图片(${name}:${id})失败`)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(`删除图片(${name}:${id})失败`)
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
      imagesColumnNumber,
      listRef,
      // urlParams,
      reFreshTimes,
      havePermission,
      handleDeleteCancel,
      handleDeleteConfirm,
      reFreshData,
      showImageDialog,
      currentImage,
      afterCloseHandle,
      handleImageClick,
    }
  },
})
</script>