# -*- coding:utf-8 -*-

from django.urls import path

from docs.views.category_user import (
    CategoryUserAddApiView,
    CategoryUserDeleteApiView,
    CategoryUserListApiView,
    CategoryUserDetailApiView,
)

urlpatterns = [
    # 前缀：/api/v1/docs/categoryuser/
    path('add', CategoryUserAddApiView.as_view(), name="add"),
    path('delete', CategoryUserDeleteApiView.as_view(), name="delete"),
    path('create', CategoryUserAddApiView.as_view(), name="create"),
    path('list', CategoryUserListApiView.as_view(), name="list"),
    path('<int:pk>', CategoryUserDetailApiView.as_view(), name="detail"),
]
