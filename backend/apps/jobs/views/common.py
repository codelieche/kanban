# -*- coding:utf-8 -*-

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from jobs.models.common import Common
from jobs.serializers.common import CommonModelSerializer


class CommonCreateApiView(generics.CreateAPIView):
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


class CommonDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    """
    Common Detail Api View
    """
    queryset = Common.objects.all()
    serializer_class = CommonModelSerializer
    permission_classes = (IsAuthenticated,)
