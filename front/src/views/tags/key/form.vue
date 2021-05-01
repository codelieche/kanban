<template>
  <BaseForm
    :name="formName"
    :fields="formFields.filter((i) => !i.hiddle)"
    :title="action === 'add' ? '添加' : '修改'"
    :data="formData"
    :handleSubmit="handleFormSubmit"
    :props="formProps"
  >
  </BaseForm>
</template>

<script lang="ts">
import { defineComponent, provide, Ref, ref, watch } from 'vue'

import BaseForm from '@/components/base/forms/baseForm.vue'
import { FormFieldItem } from '@/components/base/forms/types'

export default defineComponent({
  name: 'TagForm',
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
      key: '',
      'is_hot': false,
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
        formData.value = defaultValue
      }
      formFields.value = [
        {
          name: 'id',
          type: 'input',
          label: 'ID:',
          props: {
            size: 'small',
            disabled: action !== 'add',
          },
          hiddle: action === 'add'
        },
        {
          name: 'key',
          type: 'input',
          label: 'Key:',
          rules: [
              {required: true, message: '请填写标签值'}
          ],
          props: {
            size: 'small',
            disabled: action !== 'add',
            placeholder: 'key'
          },
        },
        {
          name: 'name',
          type: 'input',
          label: '名字:',
          props: {
            size: 'small',
            placeholder: '标签名'
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
            size: 'mini',
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
            placeholder: '描述一下',
            autosize: {
                minRows: 3,
                maxRows: 6
            }
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
      'label-width': '70px',
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

