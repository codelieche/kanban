// 顶部右侧导航接口
// 在layout/header/*.vue中会用到
export interface PageHeaderNav {
    slug: string;
    title: string;
}

export interface LeftSiderMenu {
    id: number;
    key: string;
    icon: string;
    title: string;
    link: string;
    permission: string;
    target: string;
    level: number;
    order: number;
    parent: number;
    is_deleted: boolean;
    children?: Array<LeftSiderMenu>;
}

export interface NavBreadcrumbItem {
    title: string;  // 标题
    icon?: string;  // 图标
    link?: string;  // 是否需要跳转
}