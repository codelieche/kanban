from django.contrib import admin

from account.models import UserProfile, MessageScope

# Register your models here.


class UserModelAdmin(admin.ModelAdmin):
    """
    User Model Admin
    """
    list_display = ("id", "username", "mobile", "wechart",
                    "is_active", "is_superuser", "last_login")
    list_filter = ("is_superuser", "is_active")
    list_display_links = ("username", )
    search_fields = ("username", "mobile")


class MessageScopeAdmin(admin.ModelAdmin):
    """
    Message Scope Admin
    """
    list_display = ('id', "scope", "name")
    search_fields = ('scope', 'name')


# 注册Model到admin中
admin.site.register(UserProfile, UserModelAdmin)
admin.site.register(MessageScope, MessageScopeAdmin)
