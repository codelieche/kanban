<template>
  <BaseFormDialog
    :visible="visible"
    :afterCloseHandle="afterCloseHandle"
    title="添加标签"
    buttonTitle="添加"
    :formName="formName"
    width="500px"
    :fields="formFields"
    :handleSubmit="handleFormSubmit"
  />
</template>

<script lang="ts">
import { defineComponent, provide, Ref, ref } from 'vue'
import fetchApi from '@/api/fetchApi'

import BaseFormDialog from '@/components/base/forms/baseFormDialog.vue'
import { FormFieldItem } from '@/components/base/forms/types'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'ArticleAddTagDialog',
  components: {
    BaseFormDialog,
  },
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
    articleID: Number, // 文章ID
    afterCloseHandle: Function,
    reFreshTags: Function
  },
  setup(props) {
    const formName = 'articleAddTagForm'
    // eslint-disable-next-line
    const formData: Ref<any> = ref({ key: 'tag', value: '' })
    provide(formName, formData)

    // 表单字段
    const formFields: Ref<Array<FormFieldItem>> = ref([
      {
        name: 'key',
        type: 'input',
        label: '标签:',
        rules: [
          {
            required: true,
            message: '请输入标签Key',
          },
        ],
        props: {
          size: 'small',
          disabled: false,
          clearable: true,
        },
      },
      {
        name: 'value',
        type: 'input',
        label: '值:',
        rules: [
          {
            required: true,
            message: '请输入标签值',
          },
        ],
        props: {
          size: 'small',
        },
      },
    ])

    const handleFormSubmit = () => {
    //   console.log(formData.value)
      if (!props.articleID) {
        return
      }
      // 准备数据
      const url = '/api/v1/tags/objecttag/create'
      const data = {
        key: formData.value['key'],
        value: formData.value['value'],
        'object_id': props.articleID,
        'app_label': 'docs',
        model: 'article',
      }
      
      // 发起请求
      fetchApi
        .post(url, data)
        .then((response) => response.data)
        .then((responseData) => {
          if (responseData && responseData.id > 0) {
            formData.value['value'] = ''
            ElMessage.success('添加标签成功')
            if (props.afterCloseHandle) {
              props.afterCloseHandle()
            }
            if(props.reFreshTags){
                props.reFreshTags()
            }
          } else {
            ElMessage.warning('添加标签失败')
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error('添加标签失败')
        })
    }

    return {
      formName,
      formData,
      formFields,
      handleFormSubmit,
    }
  },
})
</script>