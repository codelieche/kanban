# -*- coding:utf-8 -*-

from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/jobs/

    # Jobs Category Api
    path('category/', include(arg=('jobs.urls.category', 'jobs'), namespace='category')),
    # Jobs Job Api
    path('job/', include(arg=('jobs.urls.job', 'jobs'), namespace='job')),
    path('common/', include(arg=('jobs.urls.common', 'jobs'), namespace='common')),
]
