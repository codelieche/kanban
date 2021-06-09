# -*- coding:utf-8 -*-
"""
账号分组相关的视图函数
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from codelieche.views.viewset import ModelViewSet
from account.serializers.group import GroupModelSerializer, GroupInfoSerializer
from utils.permissions import IsSuperUser
from modellog.mixins import LoggingViewSetMixin


class GroupApiModelViewSet(ModelViewSet):
    """
    分组相关API
    """
    queryset = Group.objects.all()
    serializer_class = GroupModelSerializer
    serializer_class_set = (GroupModelSerializer, GroupInfoSerializer)
    permission_classes = (IsAuthenticated,)
    search_fields = ('name',)
    filter_fields = ("name",)
    ordering_fields = ("id",)
    ordering = ("id",)


# 下面的是老的写法，后续逐渐废弃掉，尽量使用ModelViewSet的写法
class GroupListAllView(generics.ListAPIView):
    """
    Group List All
    """
    queryset = Group.objects.all()
    serializer_class = GroupInfoSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_fields = ("name",)
    search_fields = ("name",)
    ordering_fields = ("id",)
    ordering = ("id",)
    # 不要分页
    pagination_class = None


class GroupListView(generics.ListAPIView):
    """
    Group List All
    """
    queryset = Group.objects.all()
    serializer_class = GroupInfoSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_fields = ("name",)
    search_fields = ("name",)
    ordering_fields = ("id",)
    ordering = ("id",)


class GroupCreateView(LoggingViewSetMixin, generics.CreateAPIView):
    """
    Group Create
    """
    queryset = Group.objects.all()
    serializer_class = GroupModelSerializer
    permission_classes = (IsSuperUser,)


class GroupDetailView(LoggingViewSetMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Group Detail
    支持：get、put和Delete
    """
    queryset = Group.objects.all()
    serializer_class = GroupInfoSerializer
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        self.serializer_class = GroupModelSerializer
        self.permission_classes = (IsSuperUser, )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # 如果Group中user_set不为空，就不让删除
        group = get_object_or_404(Group, *args, **kwargs)
        if group.user_set.count() > 0:
            return JsonResponse({"status": "failure", "message": "分组中还有用户，不可删除"})
        return super().destroy(request, *args, **kwargs)


class GroupEditorView(generics.RetrieveAPIView):
    """
    用户分组，获取编辑时候要用到的信息时视图函数
    """
    queryset = Group.objects.all()
    serializer_class = GroupModelSerializer
    permission_classes = (IsSuperUser,)

