<template>
  <div class="top-bar">
    <div class="title">
      <h4>BaseForm Demo 01</h4>
    </div>
  </div>

  <!-- 测试表单 -->
  <el-row :gutter="16">
    <el-col :xs="24" :sm="16" :md="16" class="min-width-600">
      <BaseForm
        :name="formName"
        title="添加"
        :fields="formFields"
        :handleSubmit="handleSubmit"
        :props="formProps"
      ></BaseForm>
    </el-col>
    <el-col :sm="4" hidden-xs-only></el-col>
  </el-row>

  <el-divider></el-divider>
  <!-- <el-button type="primary" @click="updateFormData" size="small"
    >更新Name</el-button
  >
  {{ formData }} -->
</template>

<script lang="ts">
import { defineComponent, Ref, ref, provide } from 'vue'
import BaseForm from '@/components/base/forms/baseForm.vue'
import { FormFieldItem, ChoiceItem } from '@/components/base/forms/types'
import useFetchChoices from '@/hooks/utils/useFetchChoices'

export default defineComponent({
  name: 'TestBaseForm01',
  components: { BaseForm },
  setup() {
    // BaseForm
    const formData: Ref<{
      [key: string]:
        | number
        | object
        | string
        | boolean
        | Array<object | number | string>
        | null;
    }> = ref({ hobby: [] })
    const baseFormRef = ref(null)
    const formName = 'testForm'
    provide(formName, formData) // provide后，BaseForm通过inject获取数据

    const formFields: Ref<Array<FormFieldItem>> = ref([
      {
        name: 'username',
        type: 'input',
        label: '用户名',
        help: '请输入用户名',
        rules: [
          {
            required: true,
            message: '请输入用户名',
          },
        ],
        props: {
          placeholder: '用户名',
          size: 'small',
          clearable: true,
        },
      },
      {
        name: 'password',
        type: 'input',
        label: '密码',
        help: '请输入密码',
        rules: [
          {
            required: true,
            message: '请输入用户名',
          },
        ],
        props: {
          placeholder: '用户密码',
          size: 'small',
          'show-password': true,
        },
      },
      {
        type: 'switch',
        name: 'status',
        label: '状态',
      },
      {
        type: 'radio',
        name: 'sex',
        label: '性别',
        rules: [{ required: true, message: '请选择性别' }],
        choices: [
          { text: '男', value: 'm' },
          { text: '女', value: 'f' },
        ],
      },
      {
        type: 'cascader',
        name: 'city',
        label: '城市：',
        rules: [{ required: true, message: '请选择城市' }],
        choices: [
          {
            label: '北京',
            value: 'beijing',
            children: [{ label: '北京', value: 'bj' }],
          },
          {
            label: '广东',
            value: 'guangdong',
            children: [
              { label: '广州', value: 'gz', disabled: true },
              { label: '深圳', value: 'sz' },
            ],
          },
        ],
        props: {
          clearable: true,
          'show-all-levels': false, // 显示所有层级，false的时候只显示最后一级, 但是得到的值依然是个数组
          filterable: true, // 可搜索
          props: {
            multiple: false,
            expandTrigger: 'hover', // 触发展开下级选项的方式
            checkStrictly: true, // 可选择任意一级
          },
        },
      },
      {
        type: 'select',
        name: 'category',
        label: '分组',
        rules: [{ required: true, message: '请选择分组' }],
        choices: [
          { text: '运维组', value: 'devops' },
          { text: '开发组', value: 'develop' },
        ],
        props: {
          size: 'small',
        },
      },
      {
        type: 'checkbox',
        name: 'hobby',
        label: '兴趣',
        rules: [{ required: true, message: '请选择兴趣' }],
        choices: [
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' },
          { text: 'Golang', value: 'go' },
          { text: 'JavaScript', value: 'js' },
        ],
      },
      {
        type: 'radio-button',
        name: 'active',
        label: '激活',
        rules: [{ required: true, message: '请选择激活状态' }],
        choices: [
          { text: '有效', value: true },
          { text: '禁用', value: false },
        ],
        props: { size: 'small' },
      },
      {
        name: 'description',
        type: 'input',
        label: '描述',
        rules: [
          {
            required: false,
            message: '请输入描述内容',
          },
        ],
        props: {
          placeholder: '请输入描述内容',
          size: 'small',
          clearable: true,
          type: 'textarea',
        },
      },
      {
        type: 'transfer',
        name: 'user_set',
        label: '',
        choices: [],
        props: {
          size: 'small',
          titles: ['所有用户', '组成员'],
        },
      },
    ])
    // 修改user_set的选项
    // 所有用户
    const userChoicesFields = [
      { field: 'key', valueField: 'id' },
      { field: 'label', valueField: 'username' },
      { field: 'value', valueField: 'username' },
    ]
    const callback = (objs: Array<ChoiceItem>) => {
      formFields.value.forEach((item) => {
        if (item['name'] === 'user_set') {
          item['choices'] = objs
          return
        }
      })
    }

    useFetchChoices('/api/v1/account/user/all', userChoicesFields, callback)

    const formProps = {}

    setTimeout(() => {
      formData.value = {
        username: 'Good',
        password: 'okokok',
        status: true,
        city: 'sz',
        sex: 'm',
        hobby: [],
        active: false,
        description: '描述内容',
      }
    }, 2000)

    const handleSubmit = () => {
      console.log(formData.value)
      console.log(JSON.stringify(formData.value))
    }

    const updateFormData = () => {
      formData.value.username += '='
    }

    return {
      formName,
      formProps,
      baseFormRef,
      formData,
      formFields,
      handleSubmit,
      updateFormData,
    }
  },
})
</script>