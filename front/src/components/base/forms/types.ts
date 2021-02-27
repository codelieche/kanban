// 基本表单相关的结构体

export interface ChoiceField {
    field: string;
    valueField: string;
}

export interface ChoiceItem {
    id?: number;  // 唯一ID，穿梭框会会用作为key值
    text?: string; // 展示的值
    label?: string; // 展示的值
    value: string | number | boolean; // 选项的值
    children?: Array<ChoiceItem>;  // 子元素
}

export interface ElementFormRef {
    validate: Function;
}

export interface FormItemRule {
    type?: string; // 类型
    message: string; // 提示消息
    required?: boolean; // 是否必填字段
    max?: number; // 最大值
    min?: number; // 最小值
}

export interface FormFieldItem {
    name: string; // 表单字段的名字，比如：name， Form表单中的prop也就是这个字段
    type: string; // 类型
    // model?: string; // 字段绑定的值，一般就是：formData.name
    label: string; // 表单字段的label，比如：名字
    help?: string; // 字段的帮助信息
    choices?: ChoiceItem[]; // 选项，radio, checkbox会用到
    rules?: FormItemRule[]; // 验证规则
    // value: string | number | Array<string | number | object> | null | boolean | object | undefined; // 值
    props?: object | null | undefined;  // 其它属性
    hiddle?: boolean; // 是否隐藏
}