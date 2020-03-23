"""
讨论相关的视图
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from docs.models.discussion import Discussion
from docs.serializers.discussion import DiscussionModelSerializer


class DiscussionCreateApiView(generics.CreateAPIView):
    """
    创建讨论的api
    """
    queryset = Discussion.objects.all()
    serializer_class = DiscussionModelSerializer
    permission_classes = (IsAuthenticated, )


class DiscussionListApiView(generics.ListAPIView):
    """
    讨论列表api
    """
    queryset = Discussion.objects.all()
    serializer_class = DiscussionModelSerializer
    permission_classes = (IsAuthenticated,)

    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ("content", "article__title", "user__username")
    filter_fields = ("user", "article", "group", "is_deleted")
    ordering_fields = ("id", "article", "user", "time_added", "time_updated", "is_deleted")
    ordering = ("-id",)


class DiscussionDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    讨论详情api
    """
    queryset = Discussion.objects.all()
    serializer_class = DiscussionModelSerializer
    permission_classes = (IsAuthenticated,)
