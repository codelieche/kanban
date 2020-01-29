const navData = [
    {
        icon: "user-circle",
        key: "user",
        title: "用户中心",
        subs: [
          {
            slug: "/user/group",
            icon: "group",
            title: "分组"
          },
          {
            slug: "/user/list",
            icon: "user",
            title: "用户列表"
          },
          {
            slug: "/user/message",
            icon: "list",
            title: "消息中心"
          },
          {
            slug: "/user/login",
            icon: "sign-in",
            title: "登陆"
          },
          {
            slug: "/user/logout",
            icon: "sign-out",
            title: "退出"
          }
        ]
      },
      {
        icon: "cog",
        key: "test",
        title: "测试页面",
        subs: [
          {
            slug: "/test/test",
            icon: "angle-right",
            title: "test"
          },
          {
            slug: "/test/page",
            icon: "angle-right",
            title: "Page"
          }
        ]
      }
];

export default navData;