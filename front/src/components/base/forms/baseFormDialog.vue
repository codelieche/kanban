<template>
  <el-dialog
    :title="title"
    v-model="visibleDialog"
    :width="width"
    @closed="handleDialogClose"
  >
    <el-row>
      <el-col :sm="2" hidden-xs-only="true" />
      <el-col :xs="24" :sm="20">
        <BaseForm
          :name="formName"
          :data="formData"
          :fields="fields"
          :title="buttonTitle"
          :handleSubmit="handleSubmit"
        ></BaseForm>
      </el-col>
      <el-col :sm="2" hidden-xs-only="true" />
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, ref, watch } from 'vue'

import { FormFieldItem } from './types'
import BaseForm from './baseForm.vue'

export default defineComponent({
  name: 'BaseFormDialog',
  components: {
    BaseForm,
  },
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => '表格对话框',
    },
    buttonTitle: {
      type: String,
      default: () => '提交',
    },
    width: {
      type: String,
      default: () => '460px',
    },
    formName: { 
        type: String, // 表格的名字, 数据通过
        default: () => "formNameDefault"
    },
    fields: Array as PropType<Array<FormFieldItem>>,
    data: Object, // data通过provider提供吧
    props: Object, // 表单的一些其它属性
    afterCloseHandle: Function,
    handleSubmit: Function,
  },
  setup(props) {
    const formData = inject(props.formName)
    const visibleDialog = ref(false)

    watch([props], () => {
      //   console.log("props.visible: ", props.visible)
      if (props.visible !== visibleDialog.value) {
        //   console.log('修改visibleDialog.value:', visibleDialog.value, props.visible)
        visibleDialog.value = props.visible
      }
    })

    // 关闭事件
    const handleDialogClose = (reFreshData = false) => {
      if (props.afterCloseHandle) {
        props.afterCloseHandle(reFreshData)
      }
    }

    return {
      visibleDialog,
      handleDialogClose,
      formData,
    }
  },
})
</script>