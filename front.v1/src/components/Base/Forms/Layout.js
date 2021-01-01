/**
 * 表单布局相关的变量
 */

 // 表单Item常规布局
export const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
        md: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
        md: { span: 14 }
      }
};

// 表单Item底部布局：一般用于提交按钮
export const formItemTailLayout = {
    wrapperCol: { offset: 8, span: 8 },
}

export default {
    formItemLayout,
    formItemTailLayout,
}
