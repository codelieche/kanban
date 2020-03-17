"""
Article相关的Model
"""
from django.db import models

from account.models import User
from docs.models.category import Category


class Article(models.Model):
    """
    Article Model
    """

    ARTICLE_CATEGORY_CHOICES = (
        ("docs", "文档"),
        ("kanban", "看板")
    )

    # 文章分类：可当做是工作空间、命名空间等。
    category = models.ForeignKey(verbose_name="分类", to=Category, on_delete=models.CASCADE)
    
    title = models.CharField(verbose_name="标题", max_length=256, 
                              blank=True, null=True, db_index=True)
    # 文章类型
    article_type = models.CharField(verbose_name="内容类型", choices=ARTICLE_CATEGORY_CHOICES,
                                    max_length=40, blank=True, default="docs")
    icon = models.CharField(verbose_name="图标", max_length=256, blank=True, null=True)
    description = models.CharField(verbose_name="描述", max_length=1024, blank=True, null=True)
    user = models.ForeignKey(to=User, verbose_name="创建者", blank=True, null=True, on_delete=models.SET_NULL)
    # 文章顶部的封面
    cover = models.CharField(verbose_name="封面", max_length=256, blank=True, null=True)
    # 无限内联
    parent = models.ForeignKey(to="self", verbose_name="父页面", blank=True, null=True,
                               on_delete=models.CASCADE, related_name="children")
    # 文章内容
    content = models.TextField(verbose_name="内容", blank=True, null=True)

    # 文章排序，越小的排前面
    order = models.SmallIntegerField(verbose_name="排序", default=1, blank=True)
    level = models.SmallIntegerField(verbose_name="级别", default=1, blank=True)
    # 添加时间
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)
    time_updated = models.DateTimeField(verbose_name="修改时间", blank=True, auto_now=True)
    # 文章的内容是一系列的block
    is_active = models.BooleanField(verbose_name="有效", blank=True, default=True)

    @property
    def infovalues(self):
        # 获取article的infovas：以info的id为key: {info_[int]: []}
        # 性能不太好，后续优化
        infovalues = self.infovalue_set.all().order_by("info", "order")
        results = {}
        for infovalue in infovalues:
            info = infovalue.info
            info_key = "info_{}".format(info.id)
            info_value = {
                "infovalue_id": infovalue.id,
                "value": infovalue.value,
            }

            if info.is_multiple:
                if info_key not in results:
                    # results[info_key] = [info_value]
                    results[info_key] = {
                        "id": info.id,
                        "name": info.name,
                        "is_multiple": info.is_multiple,
                        "values": [info_value]
                    }
                else:
                    if isinstance(results[info_key].get("values"), list):
                        results[info_key]["values"].append(info_value)
                    else:
                        results[info_key]["values"] = [info_value]
            else:
                results["info_{}".format(info.id)] = {
                        "id": info.id,
                        "name": info.name,
                        "is_multiple": info.is_multiple,
                        "values": info_value
                }
        # 返回结果
        return results
    
    def check_user_permission(self, user,  permission="read"):
        """
        检查用户的权限
        """
        # 1. 获取文章的分类
        category = self.category
        # 2. 判断用户是否有分类的权限
        return category.check_user_permission(user, permission)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        # 计算level
        parent = self.parent
        level = 1
        while parent:
            level += 1
            parent = parent.parent

        self.level = level
        
        return super().save(force_insert=force_insert, force_update=force_update, 
                           using=using, update_fields=update_fields)

    def __delete__(self):
        if self.is_active:
            self.is_active = True
            self.save()

    class Meta:
        verbose_name = "页面"
        verbose_name_plural = verbose_name