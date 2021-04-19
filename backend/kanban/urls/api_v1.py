# -*- coding:utf-8 -*-
from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/
    path('account/', include(arg=("account.urls.api", "account"), namespace="account")),
    # Docs相关的api
    path('docs/', include(arg=("docs.urls.api", "docs"), namespace="docs")),
    # Storage相关的api
    path('storage/', include(arg=("storage.urls.api", "storage"), namespace="storage")),

    # 配置相关的api
    path('config/', include(arg=("config.urls.api", "config"), namespace="config")),
    # Model日志相关的api
    path('modellog/', include(arg=('modellog.urls', 'modellog'), namespace='modellog')),
    # Model标签相关api
    path('tags/', include(arg=('tags.urls.api', 'tags'), namespace='tags')),
    # Utils相关的api
    path('utils/', include(arg=('utils.urls.api', 'utils'), namespace='utils')),
]
