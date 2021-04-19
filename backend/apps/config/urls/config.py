# -*- coding:utf-8 -*-

from django.urls import path

from config.views.config import (
    ConfigCreateApiView,
    ConfigListApiView,
    ConfigDetailApiView,
)

urlpatterns = [
    # 前缀：/api/v1/config/config/
    path('create', ConfigCreateApiView.as_view(), name="create"),
    path('list', ConfigListApiView.as_view(), name="list"),
    path('<int:pk>', ConfigDetailApiView.as_view(), name="detail"),
]
