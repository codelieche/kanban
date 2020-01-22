# -*- coding:utf-8 -*-

from rest_framework import generics
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions, DjangoModelPermissionsOrAnonReadOnly
)

from jobs.models.category import Category
from jobs.serializers.category import CategoryModelSerializer


class CategoryCreateApiView(generics.CreateAPIView):
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


class CategoryListAllApiView(generics.ListAPIView):
    """
    Job Category List All Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None


class CategoryDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    Job Category Detail Api View
    """
    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = CategoryModelSerializer
    permission_classes = (IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly)