# -*- coding:utf-8 -*-

from django.urls import path

from docs.views.group_user import (
    GroupUserAddApiView,
    GroupUserDeleteApiView,
    GroupUserListApiView,
    GroupUserDetailApiView,
)

urlpatterns = [
    # 前缀：/api/v1/docs/groupuser/
    path('add', GroupUserAddApiView.as_view(), name="add"),
    path('delete', GroupUserDeleteApiView.as_view(), name="delete"),
    path('create', GroupUserAddApiView.as_view(), name="create"),
    path('list', GroupUserListApiView.as_view(), name="list"),
    path('<int:pk>', GroupUserDetailApiView.as_view(), name="detail"),
]
