"""
图片相关的序列化
"""
from rest_framework import serializers

from account.models import User
from docs.models.image import Image


class ImageModelSerializer(serializers.ModelSerializer):
    """
    Image Model Serializer
    """

    user = serializers.SlugRelatedField(required=False, queryset=User.objects.all(), 
                                        slug_field="username")
    file = serializers.ImageField(required=True, help_text="上传图片")

    def validate(self, attrs):
        if self.context["request"].method == "POST":
            attrs["user"] = self.context["request"].user
        # if "is_active" not in attrs:
        #     attrs["is_active"] = True
        return attrs
    
    class Meta:
        model = Image
        fields = ("id", "filename", "user", "file", "qiniu", "time_added", "is_active")
