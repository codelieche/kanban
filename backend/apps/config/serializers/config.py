from rest_framework import serializers

from config.models.config import Config


class ConfigModelSerializer(serializers.ModelSerializer):
    """
    Config Model Serializer
    """

    class Meta:
        model = Config
        fields = (
            'id', 'code', 'name', 'value', 'category', 'description',
            'time_added', 'is_secret', 'is_active',
        )
