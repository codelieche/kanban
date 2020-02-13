# -*- coding:utf-8 -*-
from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/
    path('account/', include(arg=("account.urls.api", "account"), namespace="account")),
    # Task相关的api，可以是task和kanban开头的
    path('task/', include(arg=("task.urls.api", "task"), namespace="task")),
    path('kanban/', include(arg=("task.urls.api", "task"), namespace="kanban")),
    # Docs相关的api
    path('docs/', include(arg=("docs.urls.api", "docs"), namespace="docs")),
    
    # Pages相关的api
    path('pages/', include(arg=("pages.urls.api", "pages"), namespace="pages")),
    # 配置相关的api
    path('config/', include(arg=("config.urls.api", "config"), namespace="config")),
    # Model日志相关的api
    path('modellog/', include(arg=('modellog.urls', 'modellog'), namespace='modellog')),
    # Model标签相关api
    path('tags/', include(arg=('tags.urls.api', 'tags'), namespace='tags')),
]
