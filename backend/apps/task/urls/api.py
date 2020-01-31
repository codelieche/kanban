# -*- coding:utf-8 -*-

from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/task/

    # Jobs Category Api
    path('category/', include(arg=('task.urls.category', 'task'), namespace='category')),
    # Jobs Job Api
    path('job/', include(arg=('task.urls.job', 'task'), namespace='job')),
    path('common/', include(arg=('task.urls.common', 'task'), namespace='common')),
]
