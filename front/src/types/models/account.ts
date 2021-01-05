/**
 * account相关的model
 */

/*
{
    "id": 29,
    "codename": "add_message",
    "name": "Can add 用户消息",
    "app_model": "account.message"
}
*/
export interface Permission {
  id: number;
  codename: string;
  name: string;
  app_model: string;
}

export interface Group {
    id: number;
    name: string;
    user_set: Array<string>;
    permissions: Array<Permission>;
}
