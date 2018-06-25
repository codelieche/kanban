# -*- coding:utf-8 -*-
"""
Plan相关的序列化
"""
from rest_framework import serializers

from account.models import User
from listing.models.base import Team
from listing.models.plan import Plan


class PlanModelSerializer(serializers.ModelSerializer):
    """
    Plan Model Serailizer
    """
    teams = serializers.SlugRelatedField(read_only=False, slug_field="name", many=True,
                                         queryset=Team.objects.filter(is_deleted=False))
    users = serializers.SlugRelatedField(read_only=False, slug_field="username", many=True,
                                         queryset=User.objects.filter(is_active=True))

    class Meta:
        model = Plan
        fields = ("id", "name", "status", "status_code",  "created", "teams", "users",
                  "parent", "is_public", "is_deleted")


class PlanListSerializer(serializers.ModelSerializer):
    """
    Plan List Model Serializer
    """
    members = serializers.SlugRelatedField(read_only=True, slug_field="username", many=True)

    class Meta:
        model = Plan
        fields = ("id", "name", "created", "status", "members")
