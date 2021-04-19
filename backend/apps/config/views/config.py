# -*- coding:utf-8 -*-
from rest_framework import generics
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
# from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from modellog.mixins import LoggingViewSetMixin
from config.models.config import Config
from config.serializers.config import ConfigModelSerializer


class ConfigCreateApiView(LoggingViewSetMixin, generics.CreateAPIView):
    """
    创建配置项API
    """
    queryset = Config.objects.all()
    serializer_class = ConfigModelSerializer
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)


class ConfigListApiView(generics.ListAPIView):
    """
    配置列表
    """
    queryset = Config.objects.all()
    serializer_class = ConfigModelSerializer
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ('code', 'name',)
    filter_fields = ('code', 'is_secret', 'is_active')
    ordering_fields = ('id', 'code', 'is_secret', 'is_active', 'time_added')


class ConfigDetailApiView(LoggingViewSetMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    配置详情Api
    """
    queryset = Config.objects.all()
    serializer_class = ConfigModelSerializer
    permission_classes = (DjangoModelPermissionsOrAnonReadOnly,)
