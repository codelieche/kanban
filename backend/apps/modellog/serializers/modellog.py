# -*- coding:utf-8 -*-
from rest_framework import serializers

from modellog.models import ModelLog


class ModelLogSerializer(serializers.ModelSerializer):
    """模块日志 序列化模型"""
    action_verbose = serializers.CharField(source='get_action_flag_display', read_only=True)
    content = serializers.SerializerMethodField()

    def get_content(self, obj):
        return obj.get_content()

    class Meta:
        model = ModelLog
        fields = (
            'id', 'user', 'action', 'action_verbose',
            'package', 'model', 'object_id',
            'address', 'time_added', 'content'
        )
