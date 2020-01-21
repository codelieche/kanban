# -*- coding:utf-8 -*-
from rest_framework import serializers

from jobs.models.common import Common


class CommonModelSerializer(serializers.ModelSerializer):
    """
    Common Model Serializer
    """

    user = serializers.SlugRelatedField(slug_field="username", read_only=True)

    def validate(self, attrs):
        attrs["user"] = self.context["request"].user
        return attrs

    class Meta:
        model = Common
        fields = ("id", "job", "content", "user", "parent", "time_added", "is_deleted")
