# -*- coding:utf-8 -*-

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from modellog.mixins import LoggingViewSetMixin
from jobs.models.common import Common
from jobs.serializers.common import CommonModelSerializer


class CommonCreateApiView(LoggingViewSetMixin, generics.CreateAPIView):
    """
    Common Create Api View
    """
    queryset = Common.objects.all()
    serializer_class = CommonModelSerializer
    permission_classes = (IsAuthenticated,)


class CommonListApiView(generics.ListAPIView):
    """
    Common List Api View
    """
    queryset = Common.objects.all()
    serializer_class = CommonModelSerializer
    permission_classes = (IsAuthenticated,)


class CommonDetailApiView(LoggingViewSetMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Common Detail Api View
    """
    queryset = Common.objects.all()
    serializer_class = CommonModelSerializer
    permission_classes = (IsAuthenticated,)
