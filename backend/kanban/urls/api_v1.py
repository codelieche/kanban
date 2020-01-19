# -*- coding:utf-8 -*-
from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/
    path('account/', include(arg=("account.urls.api", "account"), namespace="account")),
    # Model日志相关的api
    path('modellog/', include(arg=('modellog.urls', 'modellog'), namespace='modellog')),
    # Model标签相关api
    path('tags/', include(arg=('tags.urls.api', 'tags'), namespace='tags')),
]
