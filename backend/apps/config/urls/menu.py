# -*- coding:utf-8 -*-

from django.urls import path

from config.views.menu import (
    MenuCreateApiView,
    MenuListApiView,
    MenuDetailApiView,
    ListUserMenuListApiView,
)

urlpatterns = [
    # 前缀：/api/v1/config/menu/
    path('create', MenuCreateApiView.as_view(), name="create"),
    path('list', MenuListApiView.as_view(), name="list"),
    path('<int:pk>', MenuDetailApiView.as_view(), name="detail"),
    path('', ListUserMenuListApiView.as_view(), name="menu"),
    path('user', ListUserMenuListApiView.as_view(), name="user_menu"),
]
