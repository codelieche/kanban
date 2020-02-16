"""
页面相关的视图
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.http.response import JsonResponse

from docs.models.article import Article
from docs.models.info import Info
from docs.serializers.article import (
    ArticleModelSerializer,
    ArticleWithInfovaluesListSerializer
)
from docs.serializers.info import InfoModelSerializer


class ArticleCreateApiView(generics.CreateAPIView):
    """
    创建页面的API
    """
    queryset = Article.objects.all()
    serializer_class = ArticleModelSerializer
    permission_classes = (IsAuthenticated,)


class ArticleListApiView(generics.ListAPIView):
    """
    创建列表的API
    """
    queryset = Article.objects.all()
    serializer_class = ArticleModelSerializer
    permission_classes = (IsAuthenticated,)
    
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("title", "parent__title")
    filter_fields = ("parent", "parent_id")
    ordering_fields = ("id", "parent_id", "parent", "order")
    ordering = ("parent", "order")

    def get_serializer_class(self):
        request = self.request
        if request.query_params.get("type") == "infovalues":
            return ArticleWithInfovaluesListSerializer
        else:
            return ArticleModelSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, args, kwargs)


class ArticleDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    创建详情的API
    """
    queryset = Article.objects.all()
    serializer_class = ArticleModelSerializer
    permission_classes = (IsAuthenticated,)


class ArticleInfoListAllApiView(generics.ListAPIView):
    """
    获取页面的所有属性列表
    """
    serializer_class = InfoModelSerializer
    permissions_classes = (IsAuthenticated, )
    pagination_class = None

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filter_fields = ("category", "category__element", "is_active")
    search_fields = ("name", "category__name")
    ordering_fields = ("id", "category", "order", "is_active")
    ordering = ("order", "id")

    def get_queryset(self):
        # print(self.args, self.kwargs)
        
        article_id = self.kwargs.get("article_id", 0)
        return Info.objects.filter(article_id=article_id)


class ArticleInfoValueApiView(APIView):
    """获取article的属性值"""

    permission_classes = (IsAuthenticated,)

    def get(self, request, article_id):
        # 获取article的id
        # article_id = self.kwargs.get("article_id", 0)
        # print(self, article_id)
        article = get_object_or_404(Article, id=article_id)

        infovalues = article.infovalues
        # print(article, infovalues)
        return JsonResponse(data=infovalues)


