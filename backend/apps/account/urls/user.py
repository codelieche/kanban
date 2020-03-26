# -*- coding:utf-8 -*-
from django.urls import path
from django.views.generic import RedirectView

from account.views.user import (
    UserListView,
    UserAllListView,
    UserDetailView,
    UserChangePasswordApiView,
    UserResetPasswordApiView
)


urlpatterns = [
    # 前缀：/api/v1/account/user/
    path('list', UserListView.as_view(), name="list"),
    path('all', UserAllListView.as_view(), name="all"),
    path('<int:pk>', UserDetailView.as_view(), name="detail"),

    # 用户能访问的菜单
    path('menu/list', RedirectView.as_view(url="/api/v1/config/menu/user"), name="menu"),
    path('nav/list', RedirectView.as_view(url="/api/v1/config/menu/user"), name="nav"),

    # 根据用户名获取用户信息
    path('<str:username>', UserDetailView.as_view(lookup_field="username"), name="detail2"),

    # 密码相关
    path('password/change', UserChangePasswordApiView.as_view(), name="password_change"),
    path('password/reset', UserResetPasswordApiView.as_view(), name="password_reset"),
]
