# -*- coding:utf-8 -*-
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from account.views.user import LoginView, account_logout
from account.views.account import TestView
from account.views.group import GroupModelViewSet


router = DefaultRouter()
router.register('group', GroupModelViewSet)

urlpatterns = [
    # 前缀：/api/v1/account/

    # ViewSet
    path('', include(router.urls), name="account"),

    # Api View
    path('login', LoginView.as_view(), name="login"),
    path('logout', account_logout, name="logout"),

    # Account Group Api
    # path('group/', include(arg=('account.urls.group', 'account'), namespace='group')),

    # Account User Api
    path('user/', include(arg=("account.urls.user", 'account'), namespace="user")),
    # Account Message Api
    path('message/', include(arg=('account.urls.message', 'account'), namespace="message")),
    # 权限
    path('permission/', include(arg=('account.urls.permission', 'account'),
                                namespace='permission')),
    # 测试api
    path('test', TestView.as_view(), name="test"),
]
