<template>
  <Comment
    :data="data.parent"
    :handleCreateDiscussion="handleCreateDiscussion"
    v-if="data.parent"
  >
    <div class="ant-comment">
      <div class="ant-comment-inner">
        <div class="ant-comment-avater">
          <el-avatar icon="el-icon-user-solid"></el-avatar>
        </div>
        <div class="ant-comment-content">
          <div class="ant-comment-content-author">
            <span class="ant-comment-content-author-name">
              {{ data.user }}
            </span>
            <span class="ant-comment-content-author-time">
              {{ moment(data.time_added, 'YYYY-MM-DD HH:mm:ss').fromNow() }}
            </span>
          </div>
          <div class="ant-comment-content-detail">
            {{ data.content }}
          </div>

          <!-- 评论的评论 -->
          <div class="comment">
            <el-input size="small" v-model="inputValue">
              <template #append>
                <el-button
                  type="primary"
                  @click.stop.prevent="handleDiscussionCommit"
                  size="small"
                  >评论</el-button
                >
              </template>
            </el-input>
          </div>

          <!-- 子元素 -->
          <slot> </slot>
        </div>
      </div>
    </div>
  </Comment>

  <!-- 这一段代码有重复之嫌 -->
  <div class="ant-comment" v-else>
    <div class="ant-comment-inner">
      <div class="ant-comment-avater">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
      </div>
      <div class="ant-comment-content">
        <div class="ant-comment-content-author">
          <span class="ant-comment-content-author-name">
            {{ data.user }}
          </span>
          <span class="ant-comment-content-author-time">
            {{ moment(data.time_added, 'YYYY-MM-DD HH:mm:ss').fromNow() }}
          </span>
        </div>
        <div class="ant-comment-content-detail">
          {{ data.content }}
        </div>

        <!-- 评论的评论 -->
        <div class="comment">
          <el-input size="small" v-model="inputValue">
            <template #append>
              <el-button
                type="primary"
                @click.stop.prevent="handleDiscussionCommit"
                size="small"
                >评论</el-button
              >
            </template>
          </el-input>
        </div>

        <!-- 子元素 -->
        <slot>
          <!-- <comment
              :data="data.parent"
              :handleCreateDiscussion="handleCreateDiscussion"
              v-if="data.parent"
            /> -->
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import moment from 'moment'

export default defineComponent({
  name: 'Comment',
  props: {
    data: Object,
    handleCreateDiscussion: Function,
    // reFreshData: Function, // 刷新评论数据
  },
  setup(props) {
    // 评论输入框内容
    const inputValue = ref('')
    // 提交评论
    const handleDiscussionCommit = () => {
      if (!inputValue.value) {
        return
      }
      // 回调函数
      const callback = () => {
        inputValue.value = ''
      }

      if (props.data && props.data.id && props.handleCreateDiscussion) {
        props.handleCreateDiscussion(
          props.data.category,
          inputValue.value,
          props.data.id,
          callback
        )
      }
    }

    return {
      inputValue,
      moment,
      handleDiscussionCommit,
    }
  },
})
</script>