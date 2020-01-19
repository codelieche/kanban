# -*- coding:utf-8 -*-
from rest_framework import serializers

from tags.models import Tag, TagValue


class TagValueModelSerializer(serializers.ModelSerializer):
    """
    标签值 Model Serializer
    """
    tag = serializers.SlugRelatedField(slug_field="tag", read_only=False,
                                       queryset=Tag.objects.all())

    class Meta:
        model = TagValue
        fields = ("id", "tag", "value")
