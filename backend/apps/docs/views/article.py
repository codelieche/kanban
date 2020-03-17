"""
页面相关的视图
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.http.response import JsonResponse, HttpResponseForbidden

from docs.models.article import Article
from docs.models.discussion import Discussion
from docs.models.info import Info
from docs.serializers.article import (
    ArticleModelSerializer,
    ArticleDetailSerializer,
    ArticleWithInfovaluesListSerializer,
    ArticleAllSerializer
)
from docs.serializers.discussion import DiscussionModelSerializer
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
    filter_fields = ("parent", "parent_id", "category", "level")
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


class ArticleListAllApiView(generics.ListAPIView):
    """
    获取所有文章列表的API
    文章是会包含子文章的，所有只需要从level是1的文章开始即可
    """
    queryset = Article.objects.filter(level=1)
    serializer_class = ArticleAllSerializer
    permission_classes = (IsAuthenticated,)
    
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("title", "parent__title")
    filter_fields = ("parent", "parent_id", "category", "level")
    ordering_fields = ("id", "parent_id", "parent", "order")
    ordering = ("parent", "order")
    # 不要分页
    pagination_class = None

    def get_serializer_class(self):
        request = self.request
        if request.query_params.get("type") == "infovalues":
            return ArticleWithInfovaluesListSerializer
        else:
            return ArticleAllSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, args, kwargs)


class ArticleDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    创建详情的API
    """
    queryset = Article.objects.all()
    serializer_class = ArticleModelSerializer
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ArticleDetailSerializer
        else:
            return ArticleModelSerializer

    def retrieve(self, request, *args, **kwargs):
        # 文章详情

        # 1. 获取到文章的分类、请求用户
        instance = super().get_object()
        user = request.user

        # 2. 检查用户是否有读的权限
        if not instance.check_user_permission(user, "read"):
            return HttpResponseForbidden()
        
        # 3. 调用父类的方法
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """更新文章"""
        # 1. 获取到文章的分类、请求用户
        instance = super().get_object()
        user = request.user

        # 2. 检查用户是否有相关的权限
        if not instance.check_user_permission(user, "update"):
            return HttpResponseForbidden()
        
        # 3. 调用父类的方法
        return super().delete(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """删除文章"""
        # 1. 获取到文章的分类、请求用户
        instance = super().get_object()
        user = request.user

        # 2. 检查用户是否有相关的权限
        if not instance.check_user_permission(user, "delete"):
            return HttpResponseForbidden()
        
        # 3. 调用父类的方法
        return super().delete(request, *args, **kwargs)


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


class ArticleDiscussionListApiView(generics.ListAPIView):
    """
    讨论列表api
    """
    # queryset = Discussion.objects.all()
    serializer_class = DiscussionModelSerializer
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("content", "article__title", "user__username")
    filter_fields = ("user", "article", "category", "is_deleted")
    ordering_fields = ("id", "article", "user", "time_added", "time_updated", "is_deleted")
    ordering = ("-id",)

    def get_queryset(self):
        # 获取当前文章的评论
        queryset = Discussion.objects.filter(**self.kwargs)
        return queryset

