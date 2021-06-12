# -*- coding:utf-8 -*-
import json

from django.contrib.contenttypes.models import ContentType

from .models import ModelLog

# Create your views here.

# SECRET_FIELDS = ('password', 'admin_pwd')
# 另外注意action_flag: 1. 添加；2. 修改；3. 删除


class LoggingBaseMethodMixin:
    """
    添加日志基本的中间件
    """

    def log_action(self, action_flag, message):
        """
        执行添加日志的操作
        :param action_flag: 操作类型
        :param message: 消息内容
        :return:
        """
        pass


class LoggingViewSetMixin:
    """
    日志记录的中间件
    """
    secret_fields = ('password', 'admin_pwd')

    # 查看对象日志开关
    retrieve_log_toogle = False

    def get_ip_address(self):
        try:
            ip_address_keys = ['HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR']
            for k in ip_address_keys:
                if self.request.META.get(k):
                    return self.request.META.get(k)
            return None
        except Exception:
            return None

    def retrieve(self, request, *args, **kwargs):
        # 查看对象、记录日志
        result = super().retrieve(request, *args, **kwargs)

        # 如果设置了记录retrieve，那么则记录查询IP
        if self.retrieve_log_toogle:
            # 第1步：获取信息
            # 发起请求的用户
            user = self.request.user
            # 获取到实例对象
            instance = self.get_object()
            # 对象model对应的ContentType
            content_type = ContentType.objects.get_for_model(instance)
            object_id = instance.pk
            object_repr = repr(instance)

            try:
                # 第3步：写入日志
                # message = "查看对象:{}".format(instance.__class__)
                message = "查看对象:{}".format(instance)
                ModelLog.objects.create(
                    user=user,
                    action=1,
                    package=content_type.app_label,
                    model=content_type.model,
                    object_id=object_id,
                    object_repr=object_repr,
                    content_type="text",
                    content=message,
                    address=self.get_ip_address(),
                )
            except Exception as e:
                # print(e)
                pass

        # 返回结果
        return result

    def perform_create(self, serializer):
        super().perform_create(serializer)
        try:
            # 发起请求的用户
            user = self.request.user
            # 这个对象的Model
            model = serializer.Meta.model
            # model对应的ContentType
            content_type = ContentType.objects.get_for_model(model)
            # 消息从data中提取
            data = json.loads(json.dumps(serializer.data))
            for field in data:
                if self.secret_fields and field in self.secret_fields: data[field] = "保密字段"
            obj = model.objects.get(pk=data['id'])

            ModelLog.objects.create(
                user=user,
                action=2,
                package=content_type.app_label,
                model=content_type.model,
                object_id=obj.id,
                object_repr=repr(obj),
                content_type='json',
                content=json.dumps(data),
                address=self.get_ip_address()
            )
        except Exception:
            pass

    def perform_update(self, serializer):
        """
        更新对象日志
        :param serializer: 序列化对象
        """
        # 第1步：先获取到修改前的对象, 得到老的数值
        # 1-1: 得到老的对象，处理处理，后续比较会用到
        obj_old = self.get_object()
        obj_old_dic = {}

        try:
            # 1-2：迭代每个validated_data字段，获取老对象这个字段的值
            for field in serializer.validated_data:
                field_v_old = getattr(obj_old, field)
                # 判断field是不是多对多关系类型
                if field_v_old.__repr__().find('ManyRelatedManager') > 0:
                    field_v_old_list_pk = list(field_v_old.values_list('pk', flat=True))
                    obj_old_dic[field] = field_v_old_list_pk
                else:
                    # 如果不是多对多的关系，直接设置其为这个值，后面字符串输出要用，field_v_old.__repr__()
                    obj_old_dic[field] = field_v_old
        except Exception:
            # 取老对象的值，如果出现异常，依然要调用父类的方法，记得要return
            super().perform_update(serializer)
            return

        # 第2步：执行父类的方法, 出错直接会返回不执行后续步骤了的
        super().perform_update(serializer)

        try:
            # 第3步：获取新的对象和其它需要用到的数据
            obj_new = self.get_object()

            # 发起请求的用户
            user = self.request.user
            # 这个对象的Model
            model = serializer.Meta.model
            # model对应的ContentType
            content_type = ContentType.objects.get_for_model(model)
            # 消息从data中提取
            try:
                data = json.loads(json.dumps(serializer.data))
            except:
                data = serializer.data

            # 第4步：判断哪些字段变更了
            # 4-1: validated_data
            validated_data = serializer.validated_data

            message = []

            # 第5步：迭代每个校验过的字段
            secret_fields = self.secret_fields if self.secret_fields else []
            for field in validated_data:
                # 5-1：获取老的字段值和新的字段值
                # obj_old_dic：老对象的值，而且多对关系的数据已经改成了pk列表
                field_v_old = obj_old_dic[field]
                field_v_new = getattr(obj_new, field)

                # 5-2：判断field是不是多对多关系类型
                if field_v_new.__repr__().find('ManyRelatedManager') > 0:
                    # 说明这个字段是多对多的关系，判断其是否相等要用.all()
                    # 5-4: 多对多关系根据主键的列表，判断是否相等
                    # list_pk_old = list(field_v_old.values_list('pk', flat=True))
                    list_pk_new = list(field_v_new.values_list('pk', flat=True))
                    if field_v_old != list_pk_new:
                        # print({'field': field, 'value': data[field]})
                        # 5-4：构造消息
                        message_i = {
                            'action': 'changed',
                            'field': field,
                            'value_new': '值修改了' if field in secret_fields else data[field],
                            'value_old': '值修改了' if field in secret_fields else field_v_old
                        }
                        message.append(message_i)
                    # else:
                    #     print('关系型数据库没变', data[field])
                else:
                    # 不是多对多关系，就直接判断值是否相等
                    if field_v_old != field_v_new:
                        # 5-4：构造消息
                        message_i = {
                            'action': 'changed',
                            'field': field,
                            'value_new': '保密字段(new)' if field in secret_fields else data[field],
                            'value_old':
                                '保密字段(old)' if field in secret_fields else field_v_old.__repr__()
                        }
                        message.append(message_i)
                        # print({'field': field, 'value': data[field]})

            # 第6步：写入日志
            if message:
                ModelLog.objects.create(
                    user=user,
                    action=3,
                    package=content_type.app_label,
                    model=content_type.model,
                    object_id=obj_new.pk,
                    object_repr=repr(obj_new),
                    content_type='json',
                    content=json.dumps(message),
                    address=self.get_ip_address(),
                )
        except Exception as e:
            # print(e)
            pass

    def perform_destroy(self, instance):
        """删除对象"""
        # 第1步：获取信息
        # 发起请求的用户
        user = self.request.user
        # 对象model对应的ContentType
        content_type = ContentType.objects.get_for_model(instance)
        object_id = instance.pk
        object_repr = repr(instance)

        # 第2步：执行父级的perform_destroy方法
        super().perform_destroy(instance)

        try:
            # 第3步：写入日志
            message = "删除对象:{}".format(instance.__class__)
            ModelLog.objects.create(
                user=user,
                action=4,
                package=content_type.app_label,
                model=content_type.model,
                object_id=object_id,
                object_repr=object_repr,
                content_type='text',
                content=json.dumps(message),
                address=self.get_ip_address(),
            )
        except Exception:
            pass
