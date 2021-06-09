<template>
  <el-row>
    <el-col :sm="3" hidden-xs-only="true" />
    <el-col :xs="24" :sm="18">
      <BaseForm
        :name="formName"
        :data="formData"
        :fields="formFields"
        title="修改"
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
  name: 'EditorForm',
  components: { BaseForm },
  props: {
    data: Object,
    handleDialogClose: Function
  },
  setup(props) {
    const formName = 'userEditorForm'
    // eslint-disable-next-line 
    const formData: Ref<any> = ref({ id: 0, username: '' })
    provide(formName, formData)
    const formFields: Ref<Array<FormFieldItem>> = ref([
      {
        name: 'username',
        type: 'input',
        label: '用户名:',
        props: {
          size: 'small',
          disabled: true,
        },
      },
      {
        name: 'is_active',
        type: 'radio-button',
        label: '状态:',
        choices: [
          { text: '开启', value: true },
          { text: '禁用', value: false },
        ],
        rules: [
          {
            required: true,
            message: '请选择状态',
          },
        ],
        props: {
          size: 'mini',
        },
      },
      {
        name: 'can_view',
        type: 'radio-button',
        label: '访问权限:',
        choices: [
          { text: '能', value: true },
          { text: '否', value: false },
        ],
        rules: [
          {
            required: true,
            message: '请选择访问权限',
          },
        ],
        props: {
          size: 'mini',
        },
      },
      {
        name: 'is_superuser',
        type: 'radio-button',
        label: '超级用户:',
        choices: [
          { text: '是', value: true },
          { text: '否', value: false },
        ],
        rules: [
          {
            required: true,
            message: '请设置是否是超级用户',
          },
        ],
        props: {
          size: 'mini',
        },
      },
      {
        name: 'mobile',
        type: 'input',
        label: '手机号:',
        props: {
          size: 'small',
        },
      },
       {
        name: 'email',
        type: 'input',
        label: '邮箱:',
        props: {
          size: 'small',
        },
      },
      {
        name: 'dingding',
        type: 'input',
        label: '钉钉号:',
        props: {
          size: 'small',
        },
      },
      {
        name: 'wechart',
        type: 'input',
        label: '微信ID:',
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
      if(formData.value && formData.value.id < 1){
          return
      }
      const url = `/api/v1/account/user/${formData.value.id}/`
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
              message: '修改用户信息成功',
              type: 'success',
            })
            if(props.handleDialogClose){
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