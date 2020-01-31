from django.contrib import admin

# Register your models here.
from config.models.menu import Menu


class MenuModelAdmin(admin.ModelAdmin):
    """
    Menu Model Admin
    """
    list_display = ("id", "title", "slug", "icon", "parent", "level", "order", "is_link", "link", "is_deleted")
    list_filter = ("parent", "level", "is_deleted")


admin.site.register(Menu, MenuModelAdmin)
