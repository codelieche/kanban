# -*- coding:utf-8 -*-
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from docs.models.common import Common
from docs.serializers.common import CommonModelSerializer


class CommonCreateApiView(generics.CreateAPIView):
    """
    Common Create Api View
    """
    queryset = Common.objects.all()
    serializer_class = CommonModelSerializer
    permission_classes = (IsAuthenticated,)


class CommonListApiView(generics.ListAPIView):
    """
    Common Create Api View
    """
    queryset = Common.objects.all()
    serializer_class = CommonModelSerializer
    filter_backends = (SearchFilter, OrderingFilter, DjangoFilterBackend)
    search_fields = ("content", "article__title", "user__username")
    ordering_fileds = ("id", "article", "time_added", "user", "is_deleted")
    filter_fields = ("article", "user", "is_deleted")
    ordering = ("-time_added",)
    permission_classes = (IsAuthenticated,)


class CommonDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    Common Detail Api View
    """
    queryset = Common.objects.filter(is_deleted=False)
    serializer_class = CommonModelSerializer
    permission_classes = (IsAuthenticated,)
