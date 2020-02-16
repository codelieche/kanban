# -*- coding:utf-8 -*-

from django.urls import path

from docs.views.info import (
    InfoCategoryListApiView,
    InfoCreateApiView,
    InfoListApiView,
    InfoDetailApiView,
    InfoAllValueListApiView,
)

urlpatterns = [
    # 前缀：/api/v1/docs/info/
    # 信息分类
    # path('category/create', InfoCategoryListApiView.as_view(), name="category_create"),
    path('category/list', InfoCategoryListApiView.as_view(), name="category.list"),
    # path('category/<int:pk>', InfoCategoryListApiView.as_view(), name="category.detail"),

    # 信息
    path("create", InfoCreateApiView.as_view(), name="create"),
    path("list", InfoListApiView.as_view(), name="list"),
    path("<int:pk>", InfoDetailApiView.as_view(), name="detail"),
    path("<int:info_id>/values", InfoAllValueListApiView.as_view(), name="values")
]
