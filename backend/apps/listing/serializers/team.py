# -*- coding:utf-8 -*-
"""
团队相关的序列化
"""
from rest_framework import serializers

from account.models import User
from listing.models.base import Team


class TeamModelSerializer(serializers.ModelSerializer):
    """
    Team Model Serializer
    """
    parent = serializers.SlugRelatedField(read_only=False, slug_field="name",
                                          queryset=Team.objects.filter(is_deleted=False))
    members = serializers.SlugRelatedField(read_only=False, slug_field="username", many=True,
                                           queryset=User.objects.filter(is_active=True))

    class Meta:
        model = Team
        fields = ("id", "name", "parent", "members", "is_deleted")
