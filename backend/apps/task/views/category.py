# -*- coding:utf-8 -*-

from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions, DjangoModelPermissionsOrAnonReadOnly
)

from modellog.mixins import LoggingViewSetMixin
from task.models.category import Category
from task.serializers.category import CategoryModelSerializer


class CategoryCreateApiView(LoggingViewSetMixin, generics.CreateAPIView):
    """
    Job Category Create Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    permission_classes = (DjangoModelPermissions,)


class CategoryListApiView(generics.ListAPIView):
    """
    Job Category List Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("name", "parent__name", "description", "code", "parent__code")
    filter_fields = ("parent", "level", "is_deleted")
    ordering_fields = ("id", "is_deleted", "parent", "order")
    ordering = ("parent", "order", "id")


class CategoryListAllApiView(generics.ListAPIView):
    """
    Job Category List All Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("name", "parent__name", "description", "code", "parent__code")
    filter_fields = ("parent", "level", "is_deleted")
    ordering_fields = ("id", "is_deleted", "parent", "order")
    ordering = ("parent", "order", "id")


class CategoryDetailApiView(LoggingViewSetMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Job Category Detail Api View
    """
    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = CategoryModelSerializer
    permission_classes = (IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly)
