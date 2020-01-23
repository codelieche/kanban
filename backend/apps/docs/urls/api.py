# -*- coding:utf-8 -*-

from django.urls import path, include


urlpatterns = [
    # 前缀：/api/v1/docs/

    # Docs Category Api
    path('category/', include(arg=('docs.urls.category', 'docs'), namespace='category')),
    # Docs Article Api
    path('article/', include(arg=('docs.urls.article', 'docs'), namespace='article')),
    # Docs Common Api
    path('common/', include(arg=('docs.urls.common', 'docs'), namespace='common')),
]
