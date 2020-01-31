# -*- coding:utf-8 -*-

from django.urls import path

from task.views.common import (
    CommonCreateApiView,
    CommonListApiView,
    CommonDetailApiView,
)

urlpatterns = [
    # 前缀：/api/v1/task/common/
    path('create', CommonCreateApiView.as_view(), name="create"),
    path('list', CommonListApiView.as_view(), name="list"),
    path('<int:pk>', CommonDetailApiView.as_view(), name="detail"),
]
