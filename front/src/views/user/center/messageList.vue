<template>
  <TopBar title="消息列表" />
  <Loading v-if="loading" />
  <div class="no-content shadow border" v-else-if="dataSource.length < 1">
    暂无消息
  </div>
  <div class="panel border" v-else>
    <div class="inner">
      <ul class="list">
        <MessageListItem
          v-for="item in dataSource"
          :key="item.id"
          :data="item"
        />
      </ul>
      <div class="more">
        <router-link to="/user/message/all">查看更多</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { useFetchListData } from '@/hooks/utils/useFetchData'

import TopBar from '@/components/page/topBar.vue'
import Loading from '@/components/page/loading.vue'
import MessageListItem from './messageListItem.vue'

export default defineComponent({
  name: 'MessageList',
  components: {
    TopBar,
    Loading,
    MessageListItem,
  },
  setup() {
    //  获取消息的api
    const apiUrl = ref('/api/v1/account/message/list')

    // 获取数据
    const { loading, dataSource } = useFetchListData(apiUrl)

    // 返回数据
    return {
      loading,
      dataSource,
    }
  },
})
</script>