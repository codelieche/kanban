# -*- coding:utf-8 -*-

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from modellog.mixins import LoggingViewSetMixin
from jobs.models.job import Job
from jobs.serializers.job import JobModelSerializer


class JobCreateApiView(LoggingViewSetMixin, generics.CreateAPIView):
    """
    Job Create Api View
    """
    queryset = Job.objects.all()
    serializer_class = JobModelSerializer
    permission_classes = (IsAuthenticated,)


class JobListApiView(generics.ListAPIView):
    """
    Job List Api View
    """
    queryset = Job.objects.all()
    serializer_class = JobModelSerializer
    permission_classes = (IsAuthenticated,)


class JobDetailApiView(LoggingViewSetMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Job Detail Api View
    """
    queryset = Job.objects.all()
    serializer_class = JobModelSerializer
    permission_classes = (IsAuthenticated,)
