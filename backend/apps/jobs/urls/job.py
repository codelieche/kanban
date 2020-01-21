# -*- coding:utf-8 -*-

from django.urls import path

from jobs.views.job import (
    JobCreateApiView,
    JobListApiView,
    JobDetailApiView,
)

urlpatterns = [
    # 前缀：/api/v1/jobs/job/
    path('create', JobCreateApiView.as_view(), name="create"),
    path('list', JobListApiView.as_view(), name="list"),
    path('<int:pk>', JobDetailApiView.as_view(), name="detail"),
]
