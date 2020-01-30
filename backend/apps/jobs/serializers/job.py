# -*- coding:utf-8 -*-
from rest_framework import serializers

from account.models import User
from jobs.models.category import Category
from jobs.models.job import Job
# from jobs.serializers.category import CategoryModelSerializer


class JobModelSerializer(serializers.ModelSerializer):
    """
    Job Model Serializer
    """
    category = serializers.SlugRelatedField(slug_field="code", queryset=Category.objects.all())
    users = serializers.SlugRelatedField(slug_field="username", many=True, queryset=User.objects.all(), read_only=False,
                                         required=False)
    creator = serializers.SlugRelatedField(slug_field="username", required=False, read_only=True)

    def validate(self, attrs):
        # print(attrs)
        attrs["creator"] = self.context["request"].user
        return attrs

    class Meta:
        model = Job
        fields = ("id", "category", "title", "image", "creator", "users",
                  "status", "parent", "order",
                  "time_added", "is_deleted", "description")
