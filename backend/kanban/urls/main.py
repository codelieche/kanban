"""kanban URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.documentation import include_docs_urls

from kanban.views.index import index_page

urlpatterns = [
    path('admin/', admin.site.urls),
    # api v1 url
    path('api/v1/', include(arg=("kanban.urls.api_v1", "kanban"), namespace="api")),

    # Djago Rest Framework自动api 文档，正式环境会取消
    path('api/docs/', include_docs_urls(title="Kanban API文档")),

    # 排除media、static、api、admin四个开头的，其它页面调用react的页面
    re_path(r'^(?!media|api|static|admin)[a-z]?', index_page),


    # 加入media路由配置，生产环境不会用这个来获取静态文件
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

