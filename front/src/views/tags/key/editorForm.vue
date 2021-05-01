<template>
  <el-row>
    <el-col :sm="3" hidden-xs-only="true" />
    <el-col :xs="24" :sm="18">
      <BaseForm
        :name="formName"
        :data="formData"
        :fields="formFields"
        title="提交修改"
        :handleSubmit="handleFormSubmit"
      ></BaseForm>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { defineComponent, provide, Ref, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import fetchApi from '@/plugins/fetchApi'

import BaseForm from '@/components/base/forms/baseForm.vue'
import { FormFieldItem } from '@/components/base/forms/types'

export default defineComponent({
  name: 'EditorForm',
  components: { BaseForm },
  props: {
    data: Object,
    handleDialogClose: Function,
  },
  setup(props) {
    const formName = 'tagkeyEditorForm'
    // eslint-disable-next-line
    const formData: Ref<any> = ref({ id: 0, username: '' })
    provide(formName, formData)
    const formFields: Ref<Array<FormFieldItem>> = ref([
      {
        name: 'id',
        type: 'input',
        label: 'ID:',
        props: {
          size: 'small',
          disabled: true,
        },
      },
      {
        name: 'key',
        type: 'input',
        label: 'Key:',
        props: {
          size: 'small',
          disabled: true,
        },
      },
      {
        name: 'name',
        type: 'input',
        label: '名字:',
        props: {
          size: 'small',
        },
      },
      {
        name: 'is_hot',
        type: 'radio-button',
        label: '状态:',
        choices: [
          { text: '热门', value: true },
          { text: '普通', value: false },
        ],
        rules: [
          {
            required: true,
            message: '请选择是否热门',
          },
        ],
        props: {
          size: 'small',
        },
      },
      {
        name: 'description',
        type: 'input',
        label: '描述:',
        rules: [{ required: false, message: '请输入Key的描述' }],
        props: {
          size: 'small',
          type: 'textarea',
        },
      },
    ])

    // 监控属性的变化
    watch(
      [props],
      () => {
        if (props.data) {
          // console.log("data变更了：", props.data)
          formData.value = props.data
        }
      },
      { immediate: true }
    )

    // 提交编辑用户
    const handleFormSubmit = () => {
      // 发起修改用户的请求
      if (formData.value && formData.value.id < 1) {
        return
      }
      const url = `/api/v1/tags/key/${formData.value.id}`
      fetchApi
        .put(url, formData.value, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            ElMessage.success({
              message: '修改标签Key成功',
              type: 'success',
            })
            if (props.handleDialogClose) {
              props.handleDialogClose(true)
            }
          } else {
            console.log(responseData)
            ElMessage.error({
              message: JSON.stringify(responseData),
              type: 'error',
            })
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error({
            message: JSON.stringify(err.data),
            type: 'error',
          })
        })
    }
    return {
      formData,
      formName,
      formFields,
      handleFormSubmit,
    }
  },
})
</script>