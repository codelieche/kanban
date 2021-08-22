<template>
  <section>
    <div class="title">
      <h2>评论</h2>
    </div>
    <div class="discussions">
      <div class="add">
        <el-input
          v-model="inputValue"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
        >
        </el-input>
        <div class="buttons">
          <el-radio-group v-model="category" size="small">
            <el-radio-button label="discussion">讨论</el-radio-button>
            <el-radio-button label="comment">评论</el-radio-button>
            <el-radio-button label="ask">提问</el-radio-button>
            <el-radio-button label="issue">问题</el-radio-button>
            <el-radio-button label="feedback">反馈</el-radio-button>
          </el-radio-group>
          <el-button
            size="mini"
            type="primary"
            class="float-right"
            :disabled="!inputValue"
            @click="handleCreateDiscussion(category, inputValue)"
            >提交</el-button
          >
        </div>
      </div>

      <div class="list">
        <Comment
          v-for="item in dataSource"
          :key="item.id"
          :data="item"
          :handleCreateDiscussion="handleCreateDiscussion"
        ></Comment>
      </div>

      <div class="more" v-if="nextPage > 0" @click="fetchData(id, nextPage)">
        还有下一页
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import fetchApi from '@/api/fetchApi'
import Comment from './comment.vue'

export default defineComponent({
  name: 'ArticleDetailDiscussions',
  props: {
    id: Number,
  },
  components: { Comment },
  setup(props) {
    // 输入框内容
    const inputValue = ref('')
    // 评论类型
    const category = ref('comment')

    // 评论列表
    const dataSource: Ref<Array<object>> = ref([])
    const dataSourceIDs: Ref<Array<number>> = ref([])

    // 是否还有下一页
    const nextPage = ref(0)

    // 获取列表
    const fetchData = (articleID: number, page: number) => {
      // 判断page是否合法
      if ((page && page < 1) || !articleID) {
        return
      }

      // 开始获取评论数据
      const url = `/api/v1/docs/article/${articleID}/discussions?page=${page}`

      // 发起请求
      fetchApi
        .get(url)
        .then((response) => response.data)
        .then((responseData) => {
          const data = responseData.results
          if (Array.isArray(data)) {
            // 如果是第1页
            if (page === 1) {
              dataSource.value = data
              const newDisscussionsIds: Array<number> = []
              data.forEach((item) => {
                newDisscussionsIds.push(item.id)
              })
              dataSourceIDs.value = newDisscussionsIds
            } else {
              // 不是第一页，那么需要对id去重
              data.forEach((item) => {
                if (item.id > 0 && dataSourceIDs.value.indexOf(item.id) < 0) {
                  dataSourceIDs.value.push(item.id)
                  dataSource.value.push(item)
                }
              })
            }

            // 判断是否有下一页
            if (responseData.next) {
              nextPage.value = page + 1
            }else{
                nextPage.value = 0
            }
          }
        })
    }

    // 监控id的变化
    watch(
      [props],
      () => {
        inputValue.value = ''
        dataSourceIDs.value = []
        dataSource.value = []
        nextPage.value = 0
        if (props.id && props.id > 0) {
          fetchData(props.id, 1)
        }
      },
      { immediate: true }
    )

    // 创建讨论
    const handleCreateDiscussion = (
      category: string,
      content: string,
      parent: number | undefined,
      callback: Function,
    ) => {
      // 判断内容是否为空
      if (!content || !props.id) {
        return
      }

      // 开始准备数据
      const url = `/api/v1/docs/discussion/create`
      const data = {
        article: props.id,
        category,
        content,
        parent,
      }

      // 发起post请求
      fetchApi
        .post(url, data)
        .then((response) => response.data)
        .then((responseData) => {
          if (responseData && responseData.id > 0) {
            ElMessage.success('添加评论成功')
            // 把输入框的内容置空
            inputValue.value = ''
            // 重新获取新的评论数据
            if (props.id) {
              fetchData(props.id, 1)
            }
            // 回调函数
            if(callback){
                callback(responseData)
            }
          } else {
            ElMessage.warning('评论失败:' + JSON.stringify(responseData))
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }

    return {
      inputValue, // 输入框内容
      category, // 评论分类
      dataSource, // 列表
      nextPage, // 下一页
      fetchData, // 获取数据
      handleCreateDiscussion, // 发起创建讨论
    }
  },
})
</script>