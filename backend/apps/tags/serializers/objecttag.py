# -*- coding:utf-8 -*-
"""
对象标签相关 serializer
"""
from rest_framework import serializers

from tags.models import TagKey, TagValue, ObjectTag


class ObjectTagCreateSerializer(serializers.Serializer):
    """
    创建对象标签序列化Model
    """
    key = serializers.CharField(max_length=40)       # key
    value = serializers.CharField(max_length=40)     # value
    app_label = serializers.CharField(max_length=40) # django中的app名称，后续也可是其它服务名
    model = serializers.CharField(max_length=40)     # 模型的名称
    object_id = serializers.IntegerField()           # 要打标签的对象ID


class ObjectTagModelSerializer(serializers.ModelSerializer):
    """
    ObjectTag Model Serializer
    """
    key = serializers.CharField(source="tagvalue.key.key")
    value = serializers.CharField(source="tagvalue.value")
    user = serializers.SlugRelatedField(slug_field="username", read_only=True)

    class Meta:
        model = ObjectTag
        fields = ("id", "key", "value", "app_label", "model", "object_id", "user", "time_added")


class ObjectTagValueSerializer(serializers.ModelSerializer):
    """
    Object TagValue Model Serializer
    """
    tagvalue_id = serializers.IntegerField(source="tagvalue.pk")
    key = serializers.CharField(source="tagvalue.key.key")
    value = serializers.CharField(source="tagvalue.value")
    # user = serializers.SlugRelatedField(slug_field="username", read_only=True)

    class Meta:
        model = ObjectTag
        fields = ("tagvalue_id", "key", "value")
