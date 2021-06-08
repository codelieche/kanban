# -*- coding:utf-8 -*-
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import (
    # 列表
    ListModelMixin,
    CreateModelMixin,    # 创建
    RetrieveModelMixin,  # 获取详情
    UpdateModelMixin,    # 更新PUT/PATCH
    DestroyModelMixin,   # 删除
)
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from modellog.mixins import LoggingViewSetMixin
from codelieche.pagination import SelfPagination


class SelfGenericViewSet(GenericViewSet):
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = []   # 可搜索的字段，支持外键比如：user__username
    pagination_class = SelfPagination
    permission_classes = (IsAuthenticated,)  # 默认是需要登录才有权限

    # 增加3个字段，一个是：
    # serializer_class_set: 集合类型，放序列化Model的集合
    # serializer_class_index：选择哪个serializer Model，默认是0，第一个
    # serializer_class_index_key：这个key，GET参数传递，默认是用detail=0
    serializer_class_set = ()   # 当一个api支持多个序列化时，就添加到这里，根据序号来选择
    serializer_class_index = 0
    serializer_class_index_key = 'detail'  # 当detail有冲突的时候，就可以使用个其它的值

    def get_serializer(self, *args, **kwargs):
        """
        Return the serializer instance that should be used for validating and
        deserializing input, and for serializing output.
        """

        # 如果GET传递了serializer_class_index_key的值，
        # 那么就使用serializer_class_index_key(默认叫detail)获取index
        query_params = self.request.query_params
        if self.serializer_class_index_key in query_params:
            serializer_class_index = query_params.get(self.serializer_class_index_key, '0')
        else:
            # 当Model中detail是Model的自有属性，
            # 那么我们可以在ModelViewSet中设置serializer_class_index_key改成其他的
            serializer_class_index = query_params.get('detail', '0')

        # 获取serizlizer_class
        serializer_class = self.get_serializer_class(serializer_class_index)
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)

    def get_serializer_class(self, serializer_class_index=0):
        """
        Return the class to use for the serializer.
        Defaults to using `self.serializer_class`.

        You may want to override this if you need to provide different
        serializations depending on the incoming request.

        (Eg. admins get full serialization, others get basic serialization)
        """
        # 1. 判断serializer_class_index是否是数字
        if serializer_class_index is not None:
            # 传入了 serializer_class_index
            try:
                serializer_class_index = int(serializer_class_index)
            except Exception as e:
                print(str(e))
                # assert False, ("'%s' serializer_class_index need is number" % self.__class__.__name__)
                # 考虑这里是否要把 serializer_class_index 设置为0
                serializer_class_index = 0

            if len(self.serializer_class_set) == 0 and self.serializer_class:
                self.serializer_class_set = (self.serializer_class,)

            # 判断设置的序列化集合长度是否 大于 serializer_class_index
            # 比如配置了[ModelSerializer, DetailSerializer, AllSerializer], 你传个3就超出下标了
            assert len(self.serializer_class_set) > serializer_class_index, (
                    "'%s' serializer_class_set length need greater than serializer_class_index"
                    "or override the `get_serializer_class()` method."
                    % self.__class__.__name__
            )

            # 返回响应序号的序列化Model
            return self.serializer_class_set[serializer_class_index]

        else:
            # 当设置了serializer_class_set, 但是未设置serializer_class，我们也初始化一下serializer_class
            if not self.serializer_class and self.serializer_class_set:
                self.serializer_class = self.serializer_class_set[0]

            assert self.serializer_class is not None, (
                    "'%s' should either include a `serializer_class` attribute, "
                    "or override the `get_serializer_class()` method."
                    % self.__class__.__name__
            )

            return self.serializer_class


class ModelViewSet(LoggingViewSetMixin,
                   CreateModelMixin,
                   RetrieveModelMixin,
                   UpdateModelMixin,
                   DestroyModelMixin,
                   ListModelMixin,
                   SelfGenericViewSet):

    @action(methods=['GET'], detail=False, description="列出全部")
    def all(self, request, *args, **kwargs):
        """
        list页是带分页的，然后all这个是不带分页，列出全部的数据，会比较耗资源
        """
        self.pagination_class = None
        return super().list(request=request, *args, **kwargs)


# 只读的ViewSet，不添加、不修改、不删除
class ReadOnlyViewSet(LoggingViewSetMixin,
                      RetrieveModelMixin,
                      ListModelMixin,
                      GenericViewSet):

    @action(methods=['GET'], detail=False, description="列出全部")
    def all(self, request, *args, **kwargs):
        """
        list页是带分页的，然后all这个是不带分页，列出全部的数据，会比较耗资源
        """
        self.pagination_class = None
        return super().list(request=request, *args, **kwargs)
