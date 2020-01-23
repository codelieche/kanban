# -*- coding:utf-8 -*-
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from docs.models.article import Article
from docs.serializers.article import ArticleModelSerializer


class ArticleCreateApiView(generics.CreateAPIView):
    """
    Article Create Api View
    """
    queryset = Article.objects.all()
    serializer_class = ArticleModelSerializer
    permission_classes = (IsAuthenticated,)


class ArticleListApiView(generics.ListAPIView):
    """
    Article List Api View
    """
    queryset = Article.objects.filter(is_deleted=False)
    serializer_class = ArticleModelSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (SearchFilter, OrderingFilter, DjangoFilterBackend)
    search_fields = ("title", "jobs__title")
    filter_fields = ("user", "categories", "jobs", "is_deleted")
    ordering_fields = ("id", "time_updated", "user")
    ordering = ("id", "time_updated")


class ArticleDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    Article Detail Api View
    """
    queryset = Article.objects.filter(is_deleted=False)
    serializer_class = ArticleModelSerializer
    permission_classes = (IsAuthenticated,)

