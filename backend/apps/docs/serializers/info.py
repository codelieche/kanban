"""
页面信息相关的序列化
"""
from rest_framework import serializers

from docs.models.info import InfoField, InfoCategory, Info, InfoValue
from docs.models.article import Article


class InfoCategoryModelSerializer(serializers.ModelSerializer):
    """"
    Info Category Model Serializer
    """

    fields = serializers.SlugRelatedField(slug_field="name", many=True, queryset=InfoField.objects.all())

    class Meta:
        model = InfoCategory
        fields = ("id", "name", "icon", "element", "fields", "order", "is_active")


class InfoModelSerializer(serializers.ModelSerializer):
    """
    Info Model Serilizer
    """

    def validate(self, attrs):
        # 如果是更新那么需要丢弃article
        if "article" in attrs or "article_id" in attrs:
            request = self.context["request"]
            if request.method in ["PUT", "PATCH"]:
                # 丢弃article或者article_id
                if "article" in attrs: attrs.pop("article")
                if "article_id" in attrs: attrs.pop("article_id")
        # 返回处理后的attrs
        # print(attrs)
        return attrs

    def update(self, instance, validated_data):
        # 如果分类变更了，是需要做一定的操作的。最简单的方式是丢弃掉它的所有值
        return super().update(instance, validated_data)

    def get_fields(self):
        # 当请求方法是GET的时候，让category是个对象，而不是是category_id
        fields = super().get_fields()
        if self.context["request"].method == "GET":
            fields["category"] = InfoCategoryModelSerializer(read_only=True, required=False)
        # print(fields)
        return fields

    class Meta:
        model = Info
        fields = ("id", "category", "name", "article", "value_type", "order", "is_multiple", "is_active")


class InfoValueModelSerializer(serializers.ModelSerializer):
    """
    Info Value Model Serilizer
    """

    class Meta:
        model = InfoValue
        fields = ("id", "info", "articles", "value", "value_type", "color", "is_active")


class InfoValueAddSerializer(serializers.Serializer):
    """
    给Article添加InfoValue
    """

    article = serializers.SlugRelatedField(slug_field="id", queryset=Article.objects.all(), required=True)
    info = serializers.SlugRelatedField(slug_field="id", queryset=Info.objects.all(), required=True)
    