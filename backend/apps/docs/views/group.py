# -*- coding:utf-8 -*-

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions, 
    DjangoModelPermissionsOrAnonReadOnly
)
from django.shortcuts import get_object_or_404

from modellog.mixins import LoggingViewSetMixin
from docs.models.group import Group
from docs.models.article import Article
from docs.serializers.group import GroupModelSerializer
from docs.serializers.article import (
    ArticleModelSerializer,
    ArticleListModelSerializer
)


class GroupCreateApiView(LoggingViewSetMixin, generics.CreateAPIView):
    """
    Docs Group Create Api View
    """
    queryset = Group.objects.all()
    serializer_class = GroupModelSerializer
    permission_classes = (DjangoModelPermissions,)


class GroupListApiView(generics.ListAPIView):
    """
    Docs Group List Api View
    """
    queryset = Group.objects.all()
    serializer_class = GroupModelSerializer
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("name", "parent__name", "description", "code", "parent__code")
    filter_fields = ("parent", "level", "is_deleted", "owner")
    ordering_fields = ("id", "is_deleted", "parent", "order", "owner")
    ordering = ("parent", "order", "id")

    def get_queryset(self):
        """获取用户的所有分类"""
        # 1. 获取到当前用户
        user = self.request.user

        if user.is_superuser:
            # 超级用户是可以看到所有的分类
            return Group.objects.all()

        # 2. 获取到用户的分类
        queryset = user.group_set.all()

        # 3. 返回queryset
        return queryset


class GroupListAllApiView(generics.ListAPIView):
    """
    Docs Group List All Api View
    """
    queryset = Group.objects.all()
    serializer_class = GroupModelSerializer
    pagination_class = None
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("name", "parent__name", "description", "code", "parent__code")
    filter_fields = ("parent", "level", "is_deleted", "owner")
    ordering_fields = ("id", "is_deleted", "parent", "order", "owner")
    ordering = ("parent", "order", "id")

    def get_queryset(self):
        """获取用户的所有分类"""
        # 1. 获取到当前用户
        user = self.request.user

        # 2. 获取到用户的分类
        queryset = user.group_set.all()

        # 3. 返回queryset
        return queryset


class GroupDetailApiView(LoggingViewSetMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Docs Group Detail Api View
    """
    queryset = Group.objects.filter()
    serializer_class = GroupModelSerializer
    permission_classes = (IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly)

    def get_object(self):
        # 先获取到pk 或者 是 code
        # 因为获取项目详情api中：detail使用的是pk，detail2中使用的是code，所以需要做下面这个处理
        filter_kwargs = {}
        for key_ in self.kwargs:
            filter_kwargs[key_] = self.kwargs[key_]
        return get_object_or_404(Group, **filter_kwargs)


class GroupArticlesListApiView(generics.ListAPIView):
    """
    分类文章的列表
    """

    queryset = Article.objects.all()
    serializer_class = ArticleListModelSerializer
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("title", "parent__title", "description")
    filter_fields = ("parent", "level", "group")
    ordering_fields = ("id", "parent", "order", "time_added", "user")
    ordering = ("id", )

    def get_queryset(self):
        queryset = Article.objects.filter(group_id=self.kwargs["pk"])
        return queryset


class GroupUserPermissionApiView(APIView):
    """
    获取当前用户分类的权限
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        group = get_object_or_404(Group, pk=pk)
        # 获取当前用户，拥有这个分类的权限列表
        permissions = group.get_user_permissions(request.user)

        return Response(data=permissions, content_type="application/json")
