"""
文章的讨论
可以是评论、问题、讨论、建议
"""
from django.db import models

from account.models import User
from docs.models.article import Article


class Discussion(models.Model):
    """
    文章讨论
    """

    CATEGORY_CHOICES = (
        ("discussion", "讨论"),
        ("comment", "评论"),
        ("ask", "提问"),
        ("issue", "问题"),
        ("feedback", "反馈")
    )

    category = models.CharField(verbose_name="分类", default="discussion", 
                                blank=True, max_length=20)
    article = models.ForeignKey(verbose_name="文章", to=Article, blank=True, on_delete=models.CASCADE)
    content = models.CharField(verbose_name="内容", max_length=1024)
    user = models.ForeignKey(verbose_name="讨论用户", to=User, blank=True, on_delete=models.CASCADE)
    parent = models.ForeignKey(verbose_name="父级讨论", to="self", blank=True, null=True, 
                               on_delete=models.CASCADE)
    time_added = models.DateTimeField(verbose_name="添加时间", blank=True, auto_now_add=True)
    time_updated = models.DateTimeField(verbose_name="更新时间", blank=True, auto_now=True)
    is_deleted = models.BooleanField(verbose_name="删除", blank=True, default=False)

    def delete(self):
        if not self.is_deleted:
            self.is_deleted = True
            self.save()
        return

    class Meta:
        verbose_name = "文章讨论"
        verbose_name_plural = verbose_name
