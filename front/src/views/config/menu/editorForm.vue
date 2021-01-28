<template>
  <el-row>
    <el-col :sm="3" hidden-xs-only="true" />
    <el-col :xs="24" :sm="18">
      <BaseForm
        :name="formName"
        :data="formData"
        :fields="formFields"
        :title="isAdd ? '添加菜单' : '提交修改'"
        :handleSubmit="handleFormSubmit"
      ></BaseForm>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { defineComponent, provide, Ref, ref, watch } from 'vue'
import BaseForm from '@/components/base/forms/baseForm.vue'
import { ChoiceItem, FormFieldItem } from '@/components/base/forms/types'
import fetchApi from '@/plugins/fetchApi'
import { ElMessage } from 'element-plus'
import useFetchChoices from '@/hooks/utils/useFetchChoices'

export default defineComponent({
  name: 'EditorForm',
  components: { BaseForm },
  props: {
    data: Object,
    handleDialogClose: Function,
    isAdd: Boolean, // 是否是添加操作
  },
  setup(props) {
    const formName = 'menuEditorForm'
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
        },
      },
      {
        name: 'title',
        type: 'input',
        label: '菜单标题:',
        props: {
          size: 'small',
        },
      },
      {
        name: 'icon',
        type: 'input',
        label: '图标',
        props: {
          size: 'small',
        },
      },
      {
        name: 'slug',
        type: 'input',
        label: '网址',
        props: {
          size: 'small',
        },
      },
      {
        name: 'is_link',
        type: 'radio-button',
        label: '是否为外链:',
        choices: [
          { text: '站外', value: true },
          { text: '站内', value: false },
        ],
        rules: [
          {
            required: true,
            message: '请选择是否为外链',
          },
        ],
        props: {
          size: 'small',
        },
      },
      {
        name: 'link',
        type: 'input',
        label: '站外链接:',
        rules: [{ required: false, message: '请输入站外链接' }],
        props: {
          size: 'small',
        },
      },
      {
        name: 'target',
        type: 'radio-button',
        label: '跳转方式:',
        choices: [
          { text: '当前页面', value: '_self' },
          { text: '新的页面', value: '_blank' },
        ],
        props: {
          size: 'small',
        },
      },
      {
        name: 'parent',
        type: 'cascader',
        label: '父级菜单:',
        props: {
          size: 'small',
          clearable: true,
          'show-all-levels': false, // 显示所有层级，false的时候只显示最后一级, 但是得到的值依然是个数组
          filterable: true, // 可搜索
          props: {
            multiple: false,
            expandTrigger: 'hover', // 触发展开下级选项的方式
            checkStrictly: true, // 可选择任意一级
          },
        },
        choices: []
      },
      {
        name: 'order',
        type: 'number',
        label: '排序:',
        props: {
          size: 'small',
        },
      },
      {
        name: 'is_deleted',
        type: 'radio-button',
        label: '状态:',
        choices: [
          { text: '禁用', value: true },
          { text: '有效', value: false },
        ],
        rules: [
          {
            required: true,
            message: '请选择是否禁用',
          },
        ],
        props: {
          size: 'small',
        },
      },
    ])

    // 获取选项
    // 所有父级选项
    const userChoicesFields = [
      // { field: 'key', valueField: 'id' },
      { field: 'label', valueField: 'slug' },
      { field: 'value', valueField: 'id' },
    ]
    const callback = (objs: Array<ChoiceItem>) => {
      formFields.value.forEach((item) => {
        if (item['name'] === 'parent') {
          item['choices'] = objs
          return
        }
      })
    }
    useFetchChoices('/api/v1/config/menu/user', userChoicesFields, callback, true)

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
      // 对parent进行处理
      if(Array.isArray(formData.value['parent']) && formData.value['parent'].length > 0){
        formData.value['parent'] = formData.value['parent'][0]
      }
      if (props.isAdd) {
        const url = '/api/v1/config/menu/create'
        fetchApi
          .post(url, formData.value, {
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
                message: '添加菜单成功',
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
      } else {
        // 更新操作
        const url = `/api/v1/config/menu/${formData.value.id}`
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
                message: '修改菜单成功',
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