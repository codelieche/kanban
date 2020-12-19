# -*- coding:utf-8 -*-
from rest_framework import serializers

from account.models import User
from storage.models.file import File


class FileModelSerializer(serializers.ModelSerializer):
    """
    File Model Serializer
    """
    user = serializers.SlugRelatedField(required=False, queryset=User.objects.all(), slug_field="username")
    file = serializers.FileField(required=True, help_text="上传文件")
    fileurl = serializers.SerializerMethodField()

    def get_fileurl(self, obj):
        return "//{}/object/{}/{}".format(self.context["request"].META['HTTP_HOST'], obj.category, obj.id)

    def validate(self, attrs):
        if self.context["request"].method == "POST":
            attrs["user"] = self.context["request"].user
            return attrs

    class Meta:
        model = File
        fields = (
             "id", "user", "filename", "category", "file", "hashcode", "fileurl",
             "objectkey", "size", "info", "time_added", "time_updated", "is_active", "description"
        )
