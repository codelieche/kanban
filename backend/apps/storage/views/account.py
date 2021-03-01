# -*- coding:utf-8 -*-
# from rest_framework import generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from modellog.mixins import LoggingViewSetMixin
from storage.models.account import Account
from storage.serializers.account import AccountModelSerializer


class AccountApiModelViewSet(LoggingViewSetMixin, ModelViewSet):
    """
    存储账号相关的api
    """
    queryset = Account.objects.all()
    serializer_class = AccountModelSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.has_perm('storage.change_account'):
            return Account.objects.all()
        else:
            return Account.objects.filter(user=user)
