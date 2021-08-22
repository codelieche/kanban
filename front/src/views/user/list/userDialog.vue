<template>
  <BaseFormDialog
    :visible="visibleForm"
    :afterCloseHandle="afterDialogCloseHandle"
    :title="title"
    :buttonTitle="action === 'add' ? '添加' : '修改'"
    :formName="formName"
    width="460px"
    :fields="formFields"
    :handleSubmit="handleFormSubmit"
    :props="formProps"
  />
</template>

<script lang="ts">
/**
 * 添加用户
 * 属性：props
 * 1. visible: 是否弹出对话框
 * 2. action: 操作，是添加还是编辑用户
 * 3. afterCloseHandle: 关闭函数，一般是控制visible的关闭
 * 4. handleSubmit: 表单提交
 */

import { defineComponent, provide, ref, Ref, watch } from 'vue'

// import fetchApi from '@/api/fetchApi'

import { FormFieldItem } from '@/components/base/forms/types'
import BaseFormDialog from '@/components/base/forms/baseFormDialog.vue'
import fetchApi from '@/api/fetchApi'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'UserDialog',
  components: {
    BaseFormDialog,
  },
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
    action: {
      type: String,
      default: () => 'add',
    },
    title: {
      type: String,
      default: () => '',
    },
    afterCloseHandle: Function,
  },
  setup(props) {
    // 是否显示表单
    const visibleForm = ref(false)
    const formName = 'userForm'
    const formData: Ref<Record<string, unknown>> = ref({})
    provide(formName, formData)

    // 表单字段
    const formFields: Ref<Array<FormFieldItem>> = ref([])

    const afterDialogCloseHandle = () => {
      if (props.afterCloseHandle) {
        props.afterCloseHandle()
      } else {
        visibleForm.value = false
      }
    }

    // 设置表单
    const initFormFieldsValue = () => {
      if (props.action === 'add') {
        formData.value = {}
        formFields.value = [
          {
            name: 'username',
            type: 'input',
            label: '用户名:',
            props: {
              size: 'small',
              disabled: false,
              placeholder: '用户名',
            },
          },
          {
            name: 'password',
            type: 'input',
            label: '密码:',
            props: {
              size: 'small',
              disabled: false,
              placeholder: 'password',
              'show-password': true,
            },
          },
          {
            name: 're_password',
            type: 'input',
            label: '确认密码:',
            props: {
              size: 'small',
              disabled: false,
              placeholder: '确认密码',
              'show-password': true,
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
                required: false,
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
                required: false,
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
                required: false,
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
            rules: [
              {
                required: true,
                message: '请设置手机号',
              },
            ],
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
        ]
      }
    }

    const handleAddUser = (data: Record<string, unknown>) => {
      const url = '/api/v1/account/user/'
      fetchApi
        .post(url, data, {})
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            ElMessage.success({
              message: '添加环境成功',
              type: 'success',
            })
            if (props.afterCloseHandle) {
              props.afterCloseHandle()
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

    // 表单提交函数
    const handleFormSubmit = () => {
      if (formData.value) {
        console.log(formData.value)
        handleAddUser(formData.value)
      }
    }

    watch(
      [props],
      () => {
        if (props.visible != visibleForm.value) {
          visibleForm.value = props.visible
          if (props.visible) {
            initFormFieldsValue()
          }
        }
      },
      { immediate: true }
    )

    // 表单属性
    const formProps = {
      'label-width': '150px',
      size: 'small',
    }

    return {
      visibleForm,
      formName,
      formData,
      formFields,
      afterDialogCloseHandle,
      handleFormSubmit,
      formProps,
    }
  },
})
</script>
