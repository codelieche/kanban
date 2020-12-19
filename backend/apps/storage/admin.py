from django.contrib import admin

# Register your models here.
from storage.models.account import Account
from storage.models.file import File


class AccountModelAdmin(admin.ModelAdmin):
    """Account Model Admin"""
    list_display = ("id", "platform", "account", "access_key", "time_added", "is_active")


class FileModelAdmin(admin.ModelAdmin):
    """
    File Model Admin
    """
    list_display = ("id", "account", "user", "filename", "file", "objectkey", "cloud_url")


admin.site.register(Account, AccountModelAdmin)
admin.site.register(File, FileModelAdmin)
