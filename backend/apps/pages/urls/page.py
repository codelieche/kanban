# -*- coding:utf-8 -*-

from django.urls import path
from pages.views.page import (
    PageCreateApiView,
    PageListApiView,
    PageDetailApiView,
)

urlpatterns = [
    # 前缀：/api/v1/pages/page/
    path('create', PageCreateApiView.as_view(), name="create"),
    path('list', PageListApiView.as_view(), name="list"),
    path('<int:pk>', PageDetailApiView.as_view(), name="detail"),
]
