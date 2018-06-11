# -*- coding:utf-8 -*-
"""
用户消息相关的序列化Model
"""
from rest_framework import serializers

from account.models import User, Message, MessageScope


class MessageSerializer(serializers.ModelSerializer):
    """
    用户消息序列化Model
    """
    user = serializers.SlugRelatedField(read_only=False, slug_field='username',
                                        queryset=User.objects.all())
    scope = serializers.SlugRelatedField(read_only=False, slug_field="scope",
                                         queryset=MessageScope.objects.all(),
                                         required=False)

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['unread'] = True
        validated_data['sender'] = user.username
        scope = validated_data.get("scope")
        if not scope:
            scope, created = MessageScope.objects.get_or_create(scope="default")
            validated_data["scope"] = scope

        return super().create(validated_data)

    class Meta:
        model = Message
        fields = ('id', 'user', 'sender', 'scope',
                  'title', 'content', 'link', 'unread', 'time_added')
