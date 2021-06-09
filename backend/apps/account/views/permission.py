# -*- coding:utf-8 -*-
"""
权限相关视图
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import Permission
from django.http.response import JsonResponse

from codelieche.views.viewset import ModelViewSet
from account.serializers.permission import PermissionInfoSerializer


class PermissionApiModelViewSet(ModelViewSet):
    """
    Permission Api View Set
    """
    queryset = Permission.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = PermissionInfoSerializer

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("content_type__app_label", "codename", "name")
    ordering_fields = ("id",)
    ordering = ("id",)

    @action(methods=['POST'], detail=False, description="权限相关的API")
    def check(self, request):
        # 1. get data
        user = request.user
        permission = request.data.get("permission", None)
        if not permission:
            content = {"status": False, "result": False, "message": "请传入permission"}
            return JsonResponse(data=content, status=400, content_type="application/json")

        if user.is_anonymous:
            content = {"status": False, "result": False, "message": "请登录"}
            return JsonResponse(data=content, status=401, content_type="application/json")

        # 2. check permission
        # u.has_perm("project.add_service")
        result = user.has_perm(permission)
        content = {
            "status": True,
            "result": result,
            "message": "检查{}的{}权限为{}".format(user.username, permission, result)
        }

        # 3. return response
        return JsonResponse(data=content, status=200, content_type="application/json")


# 下面的是老的写法，后续逐渐废弃掉，尽量使用ModelViewSet的写法
class PermissionListApiView(generics.ListAPIView):
    """
    权限列表
    """
    queryset = Permission.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = PermissionInfoSerializer

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("content_type__app_label", "codename", "name")
    ordering_fields = ("id",)
    ordering = ("id",)


class PermissionAllApiView(generics.ListAPIView):
    """
    所有权限列表api
    """
    queryset = Permission.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = PermissionInfoSerializer
    pagination_class = None


class CheckUserPermissionApiView(APIView):
    """
    检查当前用户的权限
    """
    # authentication_classes = (IsAuthenticated,)

    def post(self, request):
        # 1. get data
        user = request.user
        permission = request.data.get("permission", None)
        if not permission:
            content = {"status": False, "result": False, "message": "请传入permission"}
            return JsonResponse(data=content, status=400, content_type="application/json")

        if user.is_anonymous:
            content = {"status": False, "result": False, "message": "请登录"}
            return JsonResponse(data=content, status=401, content_type="application/json")

        # 2. check permission
        # u.has_perm("project.add_service")
        result = user.has_perm(permission)
        content = {
            "status": True,
            "result": result,
            "message": "检查{}的{}权限为{}".format(user.username, permission, result)
        }

        # 3. return response
        return JsonResponse(data=content, status=200, content_type="application/json")