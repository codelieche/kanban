# -*- coding:utf-8 -*-
from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/config/
    path("menu/", include(arg=("config.urls.menu", "config"), namespace="menu")),
    path("config/", include(arg=("config.urls.config", "config"), namespace="config")),
]
