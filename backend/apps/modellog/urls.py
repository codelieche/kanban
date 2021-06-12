# -*- coding:utf-8 -*-
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from modellog.views.modellog import (
    ModelLogApiModelViewSet,
    # ModelLogsEntryListAPIView,
    # ObjectLogsListDetailApiView,
    # LogsEntryDetailApiView
)

router = DefaultRouter()
router.register('modellog', ModelLogApiModelViewSet)

urlpatterns = [
    # 前缀：/api/v1/modellog/
    path("", include(router.urls), name="modellog"),

    # 日志详情
    # re_path(r'^(?P<pk>\d+)/?$', LogsEntryDetailApiView.as_view(), name='detail'),
    # # 模块日志列表
    # re_path(r'^(?P<app>\w+)/(?P<model>\w+)/list/?$',
    #         ModelLogsEntryListAPIView.as_view(), name="model_logs_list"),
    # # 模块中某个对象的日志列表
    # re_path(r'^(?P<app>\w+)/(?P<model>\w+)/(?P<pk>\d+)/list/?$',
    #         ObjectLogsListDetailApiView.as_view(), name='object_logs_list'),
]
