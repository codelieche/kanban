<template>
  <div class="filter">
    <div class="tags">
      <el-select
        v-model="currentTagKey"
        placeholder="标签"
        size="mini"
        :style="{width: '120px'}"
        :visible-change="true"
        @change="handleTagKeyChange"
      >
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="(item, index) in tagKeysChoices"
          :key="index"
        ></el-option>
      </el-select>

      <span class="operation">=</span>

      <el-select
        v-model="currentTagValue"
        placeholder="Value"
        size="mini"
        :style="{width: '120px'}"
        :visible-change="true"
        @change="handleTagValueChange"
      >
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="(item, index) in tagValuesChoices"
          :key="index"
        ></el-option>
      </el-select>
    </div>
    <div class="bottom" v-if="activeTagKeys">
      <el-tag size="mini" closable @close="handleFilterClear">{{activeTagKeys}} | {{ activeTagValues }}</el-tag>
      <div class="clear" @click.stop="handleFilterClear">
          清除
      </div>
    </div>

    <div class="close" @click="handleCloseFilter">
        <Icon type="close" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue'
// import { useRouter } from 'vue-router'

import Icon from '@/components/base/icon.vue'
import { ChoiceItem } from '@/components/base/forms/types'
import useFetchChoices from '@/hooks/utils/useFetchChoices'

export default defineComponent({
  name: 'ObjectTagFilter',
    components: { Icon },
  props: {
    // 页面Url的前缀
    pageUrlPrefix: { type: String, default: () => '' },
    activeTagKeys: String,        // 当前选中的标签key
    activeTagValues: String,      // 当前选中的标签值
    handleFilterClear: Function,  // 清空选择的标签处理函数
    handleTagSelected: Function,  // 标签选择的处理函数
    handleCloseFilter: Function,  // 关闭Filter的操作
  },
  setup(props) {
    // 路由
    // const router = useRouter()

    const currentTagKey = ref('')
    const currentTagValue = ref('')

    // console.log(router)

    // 标签key
    const tagKeysChoices: Ref<Array<ChoiceItem>> = ref([])
    const tagValuesChoices: Ref<Array<ChoiceItem>> = ref([])
    // 设置标签Key的选项
    const setTagKeysSelectOptions = (objs: Array<ChoiceItem>) => {
      //   console.log(objs)
      tagKeysChoices.value = objs
    }
    const setTagValuesSelectOptions = (objs: Array<ChoiceItem>) => {
      tagValuesChoices.value = objs
    }

    // 标签Key的选项
    const tagChoiceFields = [
      { field: 'label', valueField: 'key' },
      { field: 'value', valueField: 'key' },
    ]
    useFetchChoices(
      '/api/v1/tags/key/all',
      tagChoiceFields,
      setTagKeysSelectOptions
    )

    // 获取标签值的操作
    // 标签Value的选项
    const tagValueChoicesFields = [
      { field: 'label', valueField: 'value' },
      { field: 'value', valueField: 'value' },
    ]

    const getTagValuesUrl = ref('')
    // 获取标签值的选项
    useFetchChoices(
      getTagValuesUrl,
      tagValueChoicesFields,
      setTagValuesSelectOptions
    )

    const handleTagKeyChange = (value: string) => {
      //   console.log(value)
      if (value) {
        const url = `/api/v1/tags/key/${value}/values`
        getTagValuesUrl.value = url
        currentTagValue.value = ''
      } else {
        tagValuesChoices.value = []
      }
    }

    const handleTagValueChange = (value: string) => {
      //   console.log(value)
      currentTagValue.value = value
      if (props.handleTagSelected) {
        props.handleTagSelected(currentTagKey.value, currentTagValue.value)
      }
    }

    watch(
      [props],
      () => {
        if (props.activeTagKeys) {
          if (props.activeTagKeys !== currentTagKey.value) {
            currentTagKey.value = props.activeTagKeys
            handleTagKeyChange(props.activeTagKeys)
          }
        } else {
          currentTagKey.value = ''
        }

        if (props.activeTagValues) {
          if (props.activeTagValues !== currentTagValue.value) {
            currentTagValue.value = props.activeTagValues
          }
        } else {
          currentTagValue.value = ''
        }
      },
      { immediate: true }
    )

    return {
      currentTagKey,
      currentTagValue,
      tagKeysChoices,
      tagValuesChoices,
      handleTagKeyChange,
      handleTagValueChange,
    }
  },
})
</script>

<style lang="less" scoped>
.filter {
  padding: 8px 5px;
  //   min-height: 100px;
  min-width: 260px;
  position: relative;
  .close {
      position: absolute;
      top: 8px;
      right: 5px;
    //   font-size: 12px;
      font-weight: 300;
      cursor: pointer;
      display: none;
      color: #fff;
      z-index: 100;
      &:hover{
          color: #999;
          display: inline-block;
      }
  }
  &:hover {
      .close {
          display: inline-block;
      }
  }
  .tags {
    text-align: left;
  }

  .operation {
    display: inline-block;
    padding: 2px 6px;
  }

  .bottom {
    // border-top: 1px solid #d4d6d8;
    border-top: 1px solid rgba(55, 55, 50, 0.1);
    font-size: 13px;
    // cursor: pointer;
    margin-top: 10px;
    text-align: left;
    padding-top: 5px;
    position: relative;
    .clear {
      cursor: pointer;
      position: absolute;
      right: 10px;
      bottom: 6px;
      font-size: 12px;
    }
  }
}
</style>