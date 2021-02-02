<template>
  <el-row>
    <el-col :sm="3" hidden-xs-only="true" />
    <el-col :xs="24" :sm="18">
      <BaseForm
        :name="formName"
        :data="formData"
        :fields="formFields"
        title="添加"
        :handleSubmit="handleFormSubmit"
      ></BaseForm>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { defineComponent, provide, Ref, ref, watch } from 'vue'
import BaseForm from '@/components/base/forms/baseForm.vue'
import { FormFieldItem } from '@/components/base/forms/types'
import fetchApi from '@/plugins/fetchApi'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'AddUserForm',
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
        name: 'group',
        type: 'input',
        label: '分组:',
        props: {
          size: 'small',
          disabled: true,
        },
      },
      {
        name: 'user',
        type: 'input',
        label: '用户:',
        rules: [
          {
            required: true,
            message: '请输入用户！',
          },
        ],
        props: {
          size: 'small',
          disabled: false,
        },
      },
      {
        name: 'permission',
        type: 'radio-button',
        label: '权限:',
        choices: [
          { text: '读', value: 'R' },
          { text: '读写', value: 'RW' },
          { text: '全部', value: 'ALL' },
        ],
        rules: [
          {
            required: true,
            message: '请选择权限',
          },
        ],
        props: {
          size: 'small',
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
      if (formData.value && formData.value.group < 1) {
        return
      }
      const url = `/api/v1/docs/groupuser/add`
      const values = {group: formData.value['group']}
      values['user'] = [formData.value['user']]
      values['permission'] = formData.value['permission']
      fetchApi
        .post(url, values, {
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
          if (responseData && Array.isArray(responseData)) {
            ElMessage.success({
              message: '添加用户权限',
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