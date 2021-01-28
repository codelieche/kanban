<template>
  <el-row :gutter="16">
    <el-col :xs="24" :sm="18" :md="16">
      <BaseForm
        :name="formName"
        :data="formData"
        :fields="formFields"
        :title="action === 'add' ? '添加' : '修改'"
        :handleSubmit="handleFormSubmit"
        class="min-width-600"
      ></BaseForm>
    </el-col>
  </el-row>
</template>


<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  provide,
  Ref,
  ref,
  watch,
} from 'vue'
import BaseForm from '@/components/base/forms/baseForm.vue'
import { ChoiceItem, FormFieldItem } from '@/components/base/forms/types'
import { UploadFile } from 'element-plus/lib/el-upload/src/upload.type'

import { Group } from './types'
import useFetchChoices from '@/hooks/utils/useFetchChoices'

export default defineComponent({
  name: 'GroupForm',
  props: {
    action: {
      type: String,
      default: () => 'add',
    },
    data: Object as PropType<Group>,
    handleSubmit: Function,
  },
  components: { BaseForm },

  setup(props) {
    //   表单数据、名字、字段
    // eslint-disable-next-line @typescript-eslint/camelcase
    const defaultValue = { name: '', code: '' }
    const formData: Ref<Group> = ref(defaultValue)
    const formName = 'groupForm'
    provide(formName, formData)
    // 上传的图片数据
    const fileList: Ref<UploadFile[]> = ref([])
    const onUploadChange = (file: UploadFile, uploadFileList: UploadFile[]) => {
      console.log(file, uploadFileList)
      fileList.value = uploadFileList
      if(uploadFileList.length > 0 && file.raw.type.indexOf('imag') >= 0){
        const imageUrl = URL.createObjectURL(file.raw);
        formData.value['image'] = imageUrl
      }
    }
    const formFields: Ref<Array<FormFieldItem>> = ref([
      {
        name: 'name',
        type: 'input',
        label: '名字',
        rules: [
          {
            required: true,
            message: '请输入分组名',
          },
        ],
        props: {
          placeholder: '分组名',
          size: 'small',
          clearable: true,
        },
      },
      {
        name: 'code',
        type: 'input',
        label: '代码',
        rules: [
          {
            required: true,
            message: '请输入分组代码',
          },
        ],
        props: {
          placeholder: '分组名',
          size: 'small',
          clearable: true,
        },
      },
      {
        name: 'parent_id',
        type: 'cascader',
        label: '父级分组',
        rules: [
          {
            required: false,
            message: '请输入父级分组',
          },
        ],
        choices: [],
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
      },
      {
        name: 'description',
        type: 'input',
        label: '描述',
        rules: [
          {
            required: false,
            message: '请输入描述',
          },
        ],
        props: {
          placeholder: '描述内容',
          size: 'small',
          clearable: true,
          type: 'textarea',
          autosize: { minRows: 4, maxRows: 10 },
        },
      },
      {
        name: 'image',
        type: 'upload',
        label: '图片',
        rules: [
          {
            required: false,
            message: '请上传图片',
          },
        ],
        props: {
          'on-change': onUploadChange,
          // limit: 1,
        },
      },
      {
        name: 'is_deleted',
        type: 'radio-button',
        label: '状态',
        rules: [
          {
            required: false,
            message: '请输入父级分组',
          },
        ],
        choices: [
          { text: '有效', value: false },
          { text: '禁用', value: true },
        ],
        props: {
          size: 'small',
        },
      },
    ])

    const getParentChoices = () => {
      // 所有父级选项
      const userChoicesFields = [
        // { field: 'key', valueField: 'id' },
        { field: 'label', valueField: 'code' },
        { field: 'value', valueField: 'id' },
      ]
      const callback = (objs: Array<ChoiceItem>) => {
        formFields.value.forEach((item) => {
          if (item['name'] === 'parent_id') {
            item['choices'] = objs
            return
          }
        })
      }
      useFetchChoices(
        '/api/v1/docs/group/list?level=1',
        userChoicesFields,
        callback,
        true
      )
    }
    getParentChoices()

    // 表单提交函数
    const handleFormSubmit = () => {
      if (props.handleSubmit) {
        // 对parent进行处理
        if (
          Array.isArray(formData.value['parent_id']) &&
          formData.value['parent_id'].length > 0
        ) {
          formData.value['parent_id'] = formData.value['parent_id'][0]
          formData.value['parent'] = formData.value['parent_id']
        }
        props.handleSubmit(formData.value)
      }
    }

    onMounted(() => {
      if (props.data) {
        formData.value = props.data
      }
    })

    watch([props], () => {
      // console.log('props变更了', props)
      if (props.action === 'add') {
        formData.value = defaultValue
      } else {
        if (props.data) {
          formData.value = props.data
        }
      }
    })

    return {
      formName,
      formData,
      formFields,
      handleFormSubmit,
    }
  },
})
</script>