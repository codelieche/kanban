const navData = [
    {
        icon: "user-circle",
        key: "/user",
        title: "用户中心",
        subs: [
          {
            slug: "/user/group",
            icon: "group",
            title: "分组"
          },
          {
            slug: "/user/list",
            icon: "user-o",
            title: "用户列表"
          },
          {
            slug: "/user/message",
            icon: "user-circle-o",
            title: "用户中心"
          },
          {
            slug: "/user/message",
            icon: "envelope-o",
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
        key: "/test",
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
      },
      {
        icon: "link",
        key: "/link",
        title: "友情链接",
        subs: [
          {
            slug: "http://codelieche.com",
            icon: "angle-right",
            title: "编程列车",
            is_link: true,
            link: "http://www.codelieche.com"
          },
          {
            slug: "http://codelieche.com",
            icon: "angle-right",
            title: "codelieche",
            is_link: true,
            target: "_blank",
            link: "http://codelieche.com"
          }
        ]
      }
];

export default navData;