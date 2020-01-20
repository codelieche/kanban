# -*- coding:utf-8 -*-

from rest_framework import generics

from jobs.models.category import Category
from jobs.serializers.category import CategoryModelSerializer


class CategoryCreateApiView(generics.CreateAPIView):
    """
    Job Category Create Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer


class CategoryListApiView(generics.ListAPIView):
    """
    Job Category List Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer


class CategoryListAllApiView(generics.ListAPIView):
    """
    Job Category List All Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    pagination_class = None


class CategoryDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    Job Category Detail Api View
    """
    queryset = Category.objects.filter(is_deleted=False)
    serializer_class = CategoryModelSerializer
