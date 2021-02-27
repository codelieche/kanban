<template>
  <div class="filter">
    <div class="tag">
      <el-select
        v-model="currentTagKey"
        placeholder="标签"
        size="mini"
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

      <el-select
        v-model="currentTagValue"
        placeholder="Value"
        size="mini"
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
    <div class="clear" @click.stop="handleFilterClear" v-if="activeTagKeys">
      清除
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue'
// import { useRouter } from 'vue-router'

import { ChoiceItem } from '@/components/base/forms/types'
import useFetchChoices from '@/hooks/utils/useFetchChoices'

export default defineComponent({
  name: 'ObjectTagFilter',
  //   components: { Icon },
  props: {
    // 页面Url的前缀
    pageUrlPrefix: { type: String, default: () => '' },
    activeTagKeys: String,
    activeTagValues: String,
    handleFilterClear: Function,
    handleTagSelected: Function,
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
  padding: 10px;
  //   min-height: 100px;
  min-width: 200px;
  position: relative;

  .clear {
    font-size: 14px;
    cursor: pointer;
    margin-top: 10px;
    text-align: right;
    // position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
</style>