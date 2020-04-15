# -*- coding:utf-8 -*-
"""
Tag相关的序列化Model
"""
from rest_framework import serializers

from tags.models import TagKey, TagValue, ObjectTag


class TagKeyModelSerializer(serializers.ModelSerializer):
    """Tag Model Serializer"""

    def create(self, validated_data):
        # key是区分大小写的，去掉左右的空格
        key = validated_data["key"]
        validated_data["key"] = key.strip()
        return super().create(validated_data)

    class Meta:
        model = TagKey
        fields = ('id', 'key', 'name', 'description', 'is_hot', "time_added")
