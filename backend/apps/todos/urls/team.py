# -*- coding:utf-8 -*-
from django.urls import path

from todos.views.team import (
    TeamCreateApiView,
    TeamListApiView,
    TeamDetailApiView
)

urlpatterns = [
    # 前缀：/api/v1/kanban/team/
    path(r"create", TeamCreateApiView.as_view(), name="create"),
    path(r"list", TeamListApiView.as_view(), name="list"),
    path(r"<int:pk>", TeamDetailApiView.as_view(), name="detail"),
]
