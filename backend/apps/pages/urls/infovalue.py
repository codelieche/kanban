# -*- coding:utf-8 -*-

from django.urls import path

from pages.views.infovalue import (
    # InfoValueCreateApiView,
    InfoValueAddApiView,
    InfoValueListApiView,
    InfoValueDetailApiView
)

urlpatterns = [
    # 前缀：/api/v1/pages/infovalue/

    # 信息值
    # path("create", InfoValueCreateApiView.as_view(), name="create"),
    path("add", InfoValueAddApiView.as_view(), name="add"),
    path("list", InfoValueListApiView.as_view(), name="list"),
    path("<int:pk>/<int:page_id>", InfoValueDetailApiView.as_view(), name="delete_page_infovalue"),
    path("<int:pk>", InfoValueDetailApiView.as_view(), name="detail"),
]
