from django.contrib import admin

from todos.models.base import Team
from todos.models.plan import Plan


# Register your models here.

admin.site.register(Team)
admin.site.register(Plan)
