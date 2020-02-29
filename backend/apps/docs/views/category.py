# -*- coding:utf-8 -*-

from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions, 
    DjangoModelPermissionsOrAnonReadOnly
)

from modellog.mixins import LoggingViewSetMixin
from docs.models.category import Category
from docs.models.article import Article
from docs.serializers.category import CategoryModelSerializer
from docs.serializers.article import (
    ArticleModelSerializer,
    ArticleListModelSerializer
)


class CategoryCreateApiView(LoggingViewSetMixin, generics.CreateAPIView):
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

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("name", "parent__name", "description", "code", "parent__code")
    filter_fields = ("parent", "level", "is_deleted")
    ordering_fields = ("id", "is_deleted", "parent", "order")
    ordering = ("parent", "order", "id")


class CategoryListAllApiView(generics.ListAPIView):
    """
    Docs Category List All Api View
    """
    queryset = Category.objects.all()
    serializer_class = CategoryModelSerializer
    pagination_class = None
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("name", "parent__name", "description", "code", "parent__code")
    filter_fields = ("parent", "level", "is_deleted")
    ordering_fields = ("id", "is_deleted", "parent", "order")
    ordering = ("parent", "order", "id")


class CategoryDetailApiView(LoggingViewSetMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Docs Category Detail Api View
    """
    queryset = Category.objects.filter()
    serializer_class = CategoryModelSerializer
    permission_classes = (IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly)


class CategoryArticlesListApiView(generics.ListAPIView):
    """
    分类文章的列表
    """

    queryset = Article.objects.all()
    serializer_class = ArticleListModelSerializer
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("title", "parent__title", "description")
    filter_fields = ("parent", "level", "category")
    ordering_fields = ("id", "parent", "order", "time_added", "user")
    ordering = ("id", )

    def get_queryset(self):
        queryset = Article.objects.filter(category_id=self.kwargs["pk"])
        return queryset

