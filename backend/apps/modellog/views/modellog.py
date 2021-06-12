# -*- coding:utf-8 -*-
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from modellog.models import ModelLog
from modellog.serializers.modellog import ModelLogSerializer


class ModelLogApiModelViewSet(ModelViewSet):
    """
    Model日志Api
    """
    queryset = ModelLog.objects.all()
    serializer_class = ModelLogSerializer
    permission_classes = (IsAuthenticated,)

    # 以为项目不一定有 djang_filter的库，所以下面的代码注释掉了
    # filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filter_fields = ('service', 'app_label', 'model', 'action', 'user')
    # search_fields = ('service', 'app_label', 'model', 'message', 'user')
    # ordering_fields = ('id', 'time_added', 'service', 'app_label', 'model', 'action')

    def get_queryset(self):
        # 第1步：先获取到app和model的字符串以及object_id
        filders = {}
        for k in ['package', 'model', 'object_id', 'action', 'message_type', 'user']:
            if self.request.GET.get(k):
                filders[k] = self.request.GET.get(k)

        # 第2步：获取QuerySet
        queryset = ModelLog.objects.all()
        if filders:
            try:
                queryset = queryset.filter(**filders).order_by('-time_added')
            except Exception as e:
                # 这个情况主要是比如object_id是个数字类型，用户传了字母，则是可能报错的
                return []

        # 第3步：返回
        return queryset


# 老的方式API
class LogsEntryDetailApiView(generics.RetrieveAPIView):
    """日志详情API"""
    queryset = ModelLog.objects.all()
    serializer_class = ModelLogSerializer
    # 权限控制
    permission_classes = (IsAuthenticated,)


class ModelLogsEntryListAPIView(generics.ListAPIView):
    """
    获取日志列表api
    """
    queryset = ModelLog.objects.all()
    serializer_class = ModelLogSerializer
    # 权限控制
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # 第1步：先获取到app和model的字符串
        package = self.kwargs['app']
        model = self.kwargs['model']
        pk = self.kwargs['pk']

        # 第2步：获取数据
        objects_list = ModelLog.objects.filter(package=package, model=model, object_id=pk). \
            order_by('-time_added')

        # 第4步：返回数据
        return objects_list

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class ObjectLogsListDetailApiView(generics.ListAPIView):
    """
    获取model某个对象的历史记录列表
    """
    serializer_class = ModelLogSerializer
    # 权限控制
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # 第1步：先获取到app和model的字符串，pk
        package = self.kwargs['app']
        model = self.kwargs['model']
        pk = self.kwargs['pk']

        # 第2步：获取数据
        objects_list = ModelLog.objects.filter(package=package, model=model, object_id=pk).\
            order_by('-time_added')

        # 第4步：返回数据
        return objects_list

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
