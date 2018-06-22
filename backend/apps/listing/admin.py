from django.contrib import admin

from listing.models.base import Team
from listing.models.plan import Plan


# Register your models here.

admin.site.register(Team)
admin.site.register(Plan)
