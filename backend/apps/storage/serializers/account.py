# -*- coding:utf-8 -*-
from rest_framework import serializers

from account.models import User
from storage.models.account import Account


class AccountModelSerializer(serializers.ModelSerializer):
    """
    Account Model Serializer
    """
    user = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all(), required=False)

    class Meta:
        model = Account
        fields = (
            'id', 'user', 'platform',
            'account', 'access_key', 'secret_key', 'bucket', 'domain', 'is_https',
            'is_default', 'time_added', 'time_updated', 'is_active', 'description'
        )
