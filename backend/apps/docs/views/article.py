"""
页面相关的视图
"""
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
# from django.db.models import Q
from django.http.response import JsonResponse, HttpResponseForbidden

from tags.models import ObjectTag
from docs.models.group import Group
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

    def create(self, request, *args, **kwargs):
        # 判断当前用户是否有权限
        group_id = request.data.get("group", 0)
        group = Group.objects.filter(id=group_id).first()
        if group:
            user = request.user
            if not group.check_user_permission(user, "write"):
                return HttpResponseForbidden()
        else:
            return super().create(request, *args, *kwargs)

class ArticleListApiView(generics.ListAPIView):
    """
    创建列表的API
    """
    queryset = Article.objects.all()
    serializer_class = ArticleModelSerializer
    permission_classes = (IsAuthenticated,)
    
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("title", "parent__title")
    filter_fields = ("parent", "parent_id", "group", "group_id", "level")
    ordering_fields = ("id", "parent_id", "parent", "order", "time_added")
    ordering = ("parent", "order")

    def get_serializer_class(self):
        request = self.request
        if request.query_params.get("type") == "infovalues":
            return ArticleWithInfovaluesListSerializer
        else:
            return ArticleModelSerializer

    def get_queryset(self):
        # 超级用户可以查看所有，其它的用户只能看到自己创建的文章
        user = self.request.user

        # 查看是否传递了tag__key, tag__value：这2个值可以以逗号分隔
        tag__keys = self.request.query_params.get("tag__keys")
        tag__values = self.request.query_params.get("tag__values")

        # 对tag进行处理
        tag__key_list = tag__keys.split(",") if tag__keys else []
        tag__value_list = tag__values.split(",") if tag__values else []

        # 判断是否传递了标签
        objecttag_ids = None
        if tag__key_list or tag__value_list:
            if tag__key_list:
                objecttag_queryset = ObjectTag.objects.filter(app_label="docs", model="article", 
                                                              tagvalue__key__key__in=tag__key_list)
                if tag__value_list:
                    objecttag_queryset = objecttag_queryset.filter(tagvalue__value__in=tag__value_list)
            else:
                objecttag_queryset = ObjectTag.objects.filter(app_label="docs", model="article",
                                                              tagvalue__value__in=tag__value_list)
            
            # 得到对象的id: 是object_id而不是去ObjectTag的id哦
            objecttag_ids = list(objecttag_queryset.values_list("object_id", flat=True))
        
        # print("文章id列表：", objecttag_ids)
        # 获取用户的分类的文章
        if user.is_superuser:
            if isinstance(objecttag_ids, list):
                queryset = Article.objects.filter(id__in=objecttag_ids)
            else:
                queryset = Article.objects.all()
        else:
            # groups = user.group_set.all().union(user.owner_group_set.all())
            
            # 当用户以前申请过这个group，删除后是不删除GroupUser的，只是设置is_active为False而已
            groups = user.group_set.filter(
                id__in=list(user.groupuser_set.all().
                filter(is_active=True).values_list("group", flat=True))).union(
                    user.owner_group_set.all()
                )
            groups_ids = list(groups.values_list("id", flat=True))
            
            # print(groups_ids, objecttag_ids)
            if isinstance(objecttag_ids, list):
                queryset = Article.objects.filter(group_id__in=groups_ids, id__in=objecttag_ids)
            else:
                queryset = Article.objects.filter(group_id__in=groups_ids)
        # 返回结果集
        return queryset

    def list(self, request, *args, **kwargs):
        return super().list(request, args, kwargs)


class ArticleListAllApiView(generics.ListAPIView):
    """
    获取所有文章列表的API
    文章是会包含子文章的，所有只需要从level是1的文章开始即可
    """
    queryset = Article.objects.filter(level=1, is_active=True)
    serializer_class = ArticleAllSerializer
    permission_classes = (IsAuthenticated,)
    
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("title", "parent__title")
    filter_fields = ("parent", "parent_id", "group", "level")
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
        return super().update(request, *args, **kwargs)

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
    filter_fields = ("group", "group__element", "is_active")
    search_fields = ("name", "group__name")
    ordering_fields = ("id", "group", "order", "is_active")
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
    filter_fields = ("user", "article", "group", "is_deleted")
    ordering_fields = ("id", "article", "user", "time_added", "time_updated", "is_deleted")
    ordering = ("-id",)

    def get_queryset(self):
        # 获取当前文章的评论
        queryset = Discussion.objects.filter(**self.kwargs)
        return queryset

