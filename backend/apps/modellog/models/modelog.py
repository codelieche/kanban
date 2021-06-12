# -*- coding:utf-8 -*-
import json

from django.db import models
# from django.contrib.contenttypes.models import ContentType
from django.utils.encoding import force_text
from django.utils import timezone


# def get_model_path(model):
#     """
#     获取Model的路径
#     :param model: Django的Model
#     :return: 字符串型，Model的路径，比如：article.models.Category
#     """
#     return '{}.{}'.format(model.__module__, model.__qualname__)


# class ModelLogManager(models.Manager):
#     """
#     日志管理器
#     Django自带了LogEntry
#     """
#
#     def log_action(self, user_id, content_type_id, object_id, object_repr, action_flag,
#                    message=''):
#         """
#         添加日志
#         :param user_id: 用户的ID
#         :param content_type_id: 模型内容的id
#         :param object_id: 对象的id
#         :param object_repr: 对象 __repr__返回值或者 __str__
#         :param action_flag: 操作标志
#         :param message: 消息内容，默认为空
#         :return:
#         """
#
#         if isinstance(message, list):
#             message = json.dumps(message)
#         self.model.objects.create(
#             user_id=user_id,
#             content_type_id=content_type_id,
#             object_id=object_id,
#             object_repr=object_repr,
#             action_flag=action_flag,
#             message=message
#         )
#
#     def get_actions(self, user=None, action_flag=None, content_type=None, object_id=None):
#         """
#         获取用户的操作日志
#         :param user: 用户
#         :param action_flag: 操作标志：1.增加；2.修改；3.删除
#         :param content_type: 模型的content_type
#         :param object_id:
#         :return:
#         """
#         if user or action_flag or content_type or object_id:
#             fields_all = {'user': user, 'action_flag': action_flag,
#                           'content_type': content_type, 'object_id': object_id}
#             fields = {}
#             for field in fields_all:
#                 if fields_all[field]:
#                     fields[field] = fields_all[field]
#
#             return self.filter(**fields)
#         else:
#             return []


class ModelLog(models.Model):
    """
    模型的日志
    为了跟django.contrib.admin.models.LogEntry区分，就加个s
    如果不加s，还需要制定几个related_name
    """
    ACTION_FLAG_CHOICES = (
        (0, '日志'),  # 普通日志
        (1, '查看'),  # 查看Model的日志，敏感数据才会用到，默认不开启
        (2, '添加'),  # 添加对象时候记录
        (3, '修改'),  # 修改对象时候记录
        (4, '删除')   # 删除对象
    )
    # 模型日志后面可以单独抽离成一个服务
    service = models.CharField(verbose_name="服务", max_length=60, blank=True, default="self")

    # 在Django中有app这个概念, 而在Go或者Java中，就是Package
    # 那么package就保存着package/app的名字
    package = models.CharField(verbose_name="Package/App", max_length=60)
    model = models.CharField(verbose_name="Model", max_length=60)
    # 对象实例ID，戈恩局app_label和Model就可获取到对象
    object_id = models.BigIntegerField(verbose_name="对象ID")
    # 便于阅读的Object
    object_repr = models.CharField(verbose_name="对象", max_length=200)

    # 操作标志：0-5标识符: 日志、查看、创建、修改、删除
    action = models.PositiveSmallIntegerField(verbose_name="操作", choices=ACTION_FLAG_CHOICES, default=0, blank=True)
    # 日志内容类型(text/json)：有可能直接是文本(日志/查看/删除)、而修改、添加保存的是json对象
    content_type = models.CharField(verbose_name="内容类型", blank=True, default="json", max_length=10)
    content = models.TextField(verbose_name="日志内容", blank=True)

    # 操作用户
    user = models.CharField(verbose_name="用户", max_length=100, blank=True, db_index=True)
    # 操作用户的IP：注意Nginx/其它代理之后，真实的用户IP
    address = models.GenericIPAddressField(verbose_name="IP地址", blank=True, null=True)
    time_added = models.DateTimeField(verbose_name="添加时间", default=timezone.now, editable=False)

    # 使用自定义的管理器
    # objects = ModelLogManager()

    class Meta:
        verbose_name = "Model日志"
        verbose_name_plural = verbose_name
        index_together = ('package', 'model', 'object_id')
        ordering = ('-time_added', )

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        # user可以传递个对象，如果对象中有username属性话，使用username
        if not isinstance(self.user, str) or hasattr(self.user, 'username'):
            self.user = self.user.username
        super().save(force_insert=force_insert, force_update=force_update, using=using, update_fields=update_fields)

    def __repr__(self):
        return force_text(self.time_added)

    def __str__(self):
        return force_text(self.time_added)

    # def get_edited_object(self):
    #     """
    #     返回日志对象:
    #     """
    #     content_type = ContentType.objects.filter(app_label=self.package, model=self.model).first()
    #     return content_type.get_object_for_this_type(pk=self.object_id)

    def get_content(self):
        content = self.content
        if content and content.startswith(('[', '{')):
            try:
                content = json.loads(content)
                return content
            except Exception as e:
                return content
        else:
            return content
