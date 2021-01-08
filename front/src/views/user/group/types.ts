
export interface Group {
    id?: number;  // ID
    name: string;  // 字符串
    user_set: Array<string|number|object> ;
    permissions: Array<string|number|object>;
}