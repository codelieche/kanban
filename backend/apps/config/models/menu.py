# -*- coding:utf-8 -*-
"""
网站导航菜单
"""
from django.db import models


class Menu(models.Model):
    """
    网站的导航菜单
    example:
      {
         icon: "user-circle",
          key: "user",
          title: "用户中心",
          subs: [{}]
       }
    """
    TARGET_CHOICES = (
        ("_self", "默认窗口"),
        ("_blank", "新的窗口"),
        ("_parent", "父窗口"),
        ("_top", "整个窗口")
    )
    title = models.CharField(max_length=20, verbose_name="标题", db_index=True)
    # slug可以设置为相对地址，也可是绝对地址，推荐绝对地址
    slug = models.CharField(max_length=128, verbose_name="网址", unique=True)
    icon = models.CharField(max_length=20, verbose_name="图标", blank=True, null=True)
    # 父级分类
    parent = models.ForeignKey(verbose_name="父级菜单", related_name="children",
                               blank=True, null=True, to="self", on_delete=models.CASCADE)

    # 根据parent自动计算level
    level = models.SmallIntegerField(default=1, blank=True, verbose_name="级别", db_index=True)
    # 能访问本菜单需要的权限，默认为空
    permission = models.CharField(verbose_name="权限", max_length=100, blank=True, null=True)

    # 导航菜单点击的方式有：target：规定在何处打开链接文档
    # target的值有：_blank(新的窗口打开), _parent, _self(默认，当前窗口打开), _top
    target = models.CharField(verbose_name="点击跳转方式", max_length=10,
                              choices=TARGET_CHOICES, blank=True, default="_self")
    # 是否是外部链接,有值的话就是
    is_link = models.BooleanField(verbose_name="是否是站外链接", default=False, blank=True)
    link = models.URLField(verbose_name="站外链接", max_length=128, blank=True, null=True)
    order = models.SmallIntegerField(verbose_name="排序", default=1, blank=True)
    is_deleted = models.BooleanField(verbose_name="是否删除", blank=True, default=False)
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        # 自动计算parent
        level = 1
        parent = self.parent
        while parent:
            level += 1
            parent = parent.parent
        # 对level赋值
        self.level = level

        # 对slug进行处理
        self.slug = self.slug.strip()
        if not self.slug.startswith((".", "/", "http")):
            self.slug = "/{}".format(self.slug)

        # 调用父方法
        return super().save(force_insert=force_insert, force_update=force_update,
                            using=using, update_fields=update_fields)

    def __str__(self):
        return self.slug

    def __delete__(self, instance):
        if not instance.is_deleted:
            instance.is_deleted = True
            instance.save()

    class Meta:
        verbose_name = "导航菜单"
        verbose_name_plural = verbose_name
        ordering = ("level", "order")

