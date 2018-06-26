# -*- coding:utf-8 -*-
"""
Team相关的视图
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from todos.models.base import Team
from todos.serializers.team import TeamModelSerializer


class TeamCreateApiView(generics.CreateAPIView):
    """
    团队创建api
    """
    queryset = Team.objects.all()
    serializer_class = TeamModelSerializer
    permission_classes = (DjangoModelPermissions,)


class TeamListApiView(generics.ListAPIView):
    """
    团队列表api
    """
    queryset = Team.objects.filter(is_deleted=False).order_by("id")
    serializer_class = TeamModelSerializer
    permission_classes = (IsAuthenticated,)


class TeamDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    团队详情api
    """
    queryset = Team.objects.filter(is_deleted=False).order_by("id")
    serializer_class = TeamModelSerializer
    permission_classes = (IsAuthenticated, DjangoModelPermissions)
