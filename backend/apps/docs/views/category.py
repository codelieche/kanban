# -*- coding:utf-8 -*-

from rest_framework import generics
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions, DjangoModelPermissionsOrAnonReadOnly
)

from docs.models.category import Category
from docs.serializers.category import CategoryModelSerializer


class CategoryCreateApiView(generics.CreateAPIView):
    """
    Docs Category Create Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    permission_classes = (DjangoModelPermissions,)


class CategoryListApiView(generics.ListAPIView):
    """
    Docs Category List Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    permission_classes = (IsAuthenticated,)


class CategoryListAllApiView(generics.ListAPIView):
    """
    Docs Category List All Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    pagination_class = None
    permission_classes = (IsAuthenticated,)


class CategoryDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    Docs Category Detail Api View
    """
    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = CategoryModelSerializer
    permission_classes = (IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly)
