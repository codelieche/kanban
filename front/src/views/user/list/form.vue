<template>
  <BaseForm
    :name="formName"
    :fields="formFields.filter(i => !i.hiddle)"
    :title="action === 'add' ? '添加' : '修改'"
    :handleSubmit="handleFormSubmit"
    :data="formData"
    :props="formProps"
  >
  </BaseForm>
</template>

<script lang="ts">
import { defineComponent, provide, Ref, ref, watch } from 'vue'

import BaseForm from '@/components/base/forms/baseForm.vue'
import { FormFieldItem } from '@/components/base/forms/types'

export default defineComponent({
  name: 'UserForm',
  components: {
    BaseForm,
  },
  props: {
    action: {
      type: String,
      default: () => 'add',
    },
    data: Object,
    handleSubmit: Function,
  },
  setup(props) {
    // 表单数据、名称、字段
    const defaultValue = {
      username: '',
    }
    const formName = 'userForm'
    const formData: Ref<Record<string, unknown>> = ref({})
    provide(formName, formData)

    // 表单字段列表
    const formFields: Ref<Array<FormFieldItem>> = ref([])

    // 设置表单
    const initFormFieldsValue = () => {
        const action = props.action
      if (action === 'add') {
        formData.value = {}
      }
        formFields.value = [
          {
            name: 'username',
            type: 'input',
            label: '用户名:',
            props: {
              size: 'small',
              disabled: action !== 'add',
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
            hiddle: action !== 'add',
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
            hiddle: action !== 'add',
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

    watch(
      [props],
      () => {
        if (props.action === 'add') {
          formData.value = defaultValue
          initFormFieldsValue()
        } else {
          if (props.data) {
            formData.value = props.data
            initFormFieldsValue()
          }
        }
      },
      { immediate: true }
    )

    // 表单提交函数
    const handleFormSubmit = () => {
      if (props.handleSubmit) {
        props.handleSubmit(formData.value)
      }
    }

    // 表单属性
    const formProps = {
      'label-width': '120px',
      size: 'mini',
    }
    return {
      formName,
      formData,
      formFields,
      handleFormSubmit,
      formProps,
    }
  },
})
</script>

