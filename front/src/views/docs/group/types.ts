
export interface Group {
    id?: number;  // ID
    name: string;  // 字符串
    code: string ;
    parent?: string | number | object; // 父级ID
    parent_id?: string | number; // 父级ID
    description?: string;  // 描述内容 
}