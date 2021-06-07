export interface UserInfo {
    id: number; // 用户ID
    username: string;  // 用户名
    nick_name: string; // 昵称
    mobile?: string; // 手机号
    email?: string; // 邮箱
    is_superuser?: boolean;  // 是否是管理员
    logined?: boolean;  // 是否已经登录
    roles?: string[];  // 角色列表
}
export default UserInfo
