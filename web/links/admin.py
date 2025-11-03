from django.contrib import admin
from .models import Link, Platform


@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    readonly_fields = ("uuid",)
    list_display = ["platform_name", "link_url", "user"]

    @admin.display(description="Platform", ordering="platform__platform_name")
    def platform_name(self, obj):
        return obj.platform.platform_name


@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    readonly_fields = ("uuid",)
    list_display = ["platform_name", "platform_origin", "has_platform_icon"]

    @admin.display(description="Uploaded icon")
    def has_platform_icon(self, obj):
        return obj.platform_icon is not None
