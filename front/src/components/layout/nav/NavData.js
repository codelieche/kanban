const navData = [
    {
        icon: "el-icon-s-custom",
        key: "/user",
        title: "用户中心",
        level: 1,
        children: [
          {
            slug: "/user/group",
            icon: "el-icon-arrow-right",
            title: "分组",
            level: 2,
          },
          {
            slug: "/user/list",
            icon: "el-icon-arrow-right",
            title: "用户列表",
            level: 2,
          },
          {
            slug: "/user/info",
            icon: "el-icon-arrow-right",
            title: "用户信息",
            level: 2,
            children: [
                {
                  slug: "/user/info/001",
                  icon: "el-icon-arrow-right",
                  title: "信息001",
                  level: 3,
                },
            ]
          },
          {
            slug: "/user/message",
            icon: "el-icon-arrow-right",
            title: "消息中心",
            level: 2,
          },
          {
            slug: "/user/login",
            icon: "el-icon-arrow-right",
            title: "登陆",
            level: 2,
          },
          {
            slug: "/user/logout",
            icon: "el-icon-arrow-right",
            title: "退出",
            level: 2
          }
        ]
      },
      {
        icon: "el-icon-s-tools",
        key: "/test",
        title: "测试页面",
        level: 1,
        children: [
          {
            slug: "/test/test",
            key: "/test/test",
            icon: "el-icon-arrow-right",
            title: "test",
            level: 2
          },
          {
            slug: "/test/page",
            key: "/test/page",
            icon: "el-icon-arrow-right",
            title: "Page",
            level: 2
          },
          {
            slug: "/test/full",
            key: "/test/full",
            icon: "el-icon-arrow-right",
            title: "Full",
            level: 2
          }
        ]
      },
      {
        icon: "el-icon-s-goods",
        key: "/user-menu",
        title: "用户菜单",
        slug: "/user/menu",
        level: 1,
      },
      {
        icon: "el-icon-link",
        key: "/link",
        title: "友情链接",
        level: 1,
        children: [
          {
            slug: "http://codelieche.com",
            icon: "el-icon-arrow-right",
            title: "编程列车",
            // eslint-disable-next-line @typescript-eslint/camelcase
            is_link: true,
            link: "http://www.codelieche.com",
            level: 2
          },
          {
            slug: "http://codelieche.com",
            icon: "el-icon-arrow-right",
            title: "codelieche",
            // eslint-disable-next-line @typescript-eslint/camelcase
            is_link: true,
            target: "_blank",
            link: "http://codelieche.com",
            level: 2
          }
        ]
      },
      {
        icon: "el-icon-s-promotion",
        key: "/kanban-codelieche",
        title: "看板",
        slug: "http://kanban.codelieche.com",
        // eslint-disable-next-line @typescript-eslint/camelcase
        is_link: true,
        target: "_blank",
        link: "http://kanban.codelieche.com",
        level: 1,
      },
];

export default navData;