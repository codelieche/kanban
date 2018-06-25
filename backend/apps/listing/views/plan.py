# -*- coding:utf-8 -*-
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from listing.models.plan import Plan
from listing.serializers.plan import (
    PlanListSerializer,
    PlanModelSerializer
)


class PlanListApiView(generics.ListAPIView):
    """
    计划列表api
    """
    queryset = Plan.objects.filter(parent=None)
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    serializer_class = PlanListSerializer
    permission_classes = (IsAuthenticated,)
