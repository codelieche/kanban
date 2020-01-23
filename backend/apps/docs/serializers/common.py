# -*- coding:utf-8 -*-
from rest_framework import serializers

from docs.models.common import Common


class CommonModelSerializer(serializers.ModelSerializer):
    """
    Common Model Serializer
    """

    user = serializers.SlugRelatedField(slug_field="username", read_only=True)

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

    class Meta:
        model = Common
        fields = ("id", "article", "content", "user", "time_added", "time_updated", "is_deleted", "parent")

