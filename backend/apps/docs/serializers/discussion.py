"""
反馈相关的序列化
"""
from rest_framework import serializers

from account.models import User
from docs.models.article import Article
from docs.models.discussion import Discussion


class DiscussionModelSerializer(serializers.ModelSerializer):
    """
    Discussion Model Serializer
    """

    user = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all(), required=False)

    def create(self, validated_data):
        # 创建的时候，记得修改user为当前用户
        user = self.context["request"].user
        validated_data["user"] = user

        # 判断是否传递了parent
        if "parent" in validated_data and validated_data["parent"]:
            parent = validated_data["parent"]
            article = parent.article
            # while parent:
            #     article = parent.article
            #     parent = parent.parent

            # 修改当前讨论的article为父级的article
            validated_data["article"] = article

        # 调用父类的复方，创建Discussion实例
        instance = super().create(validated_data=validated_data)
        return instance

    class Meta:
        model = Discussion
        fields = (
            "id", "category", "article", "content", "parent",
            "user", "time_added", "time_updated", "is_deleted"
            )
