# -*- coding:utf-8 -*-
from rest_framework import serializers

from tags.models import TagKey, TagValue


class TagValueModelSerializer(serializers.ModelSerializer):
    """
    标签值 Model Serializer
    """
    # 键值对，区分大小写的
    key = serializers.SlugRelatedField(slug_field="key", read_only=False,
                                       queryset=TagKey.objects.all())

    class Meta:
        model = TagValue
        fields = ("id", "key", "value")
