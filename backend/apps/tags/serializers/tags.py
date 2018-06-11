# -*- coding:utf-8 -*-
"""
Tag相关的序列化Model
"""
from rest_framework import serializers

from tags.models import Tag, TagValue, ObjectTag


class TagModelSerializer(serializers.ModelSerializer):
    """Tag Model Serializer"""
    class Meta:
        model = Tag
        fields = ('id', 'tag', 'name', 'description', 'is_hot')
