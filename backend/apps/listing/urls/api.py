# -*- coding:utf-8 -*-
from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/kanban/
    path("team/", include(arg=("listing.urls.team", "team"), namespace="team")),
]

