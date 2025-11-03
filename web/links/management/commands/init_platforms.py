import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.core.files import File
from links.models import Platform

# # (platform_name, platform_color, platform_icon, platform_origin)
PLATFORMS = [
    ("codepen", "#000000", "icon-codepen.svg", "https://www.codepen.io"),
    ("codewars", "#8A1A50", "icon-codewars.svg", "https://www.codewars.com"),
    ("devto", "#333333", "icon-devto.svg", "https://www.dev.to"),
    ("facebook", "#2442AC", "icon-facebook.svg", "https://www.facebook.com"),
    (
        "freecodecamp",
        "#302267",
        "icon-freecodecamp.svg",
        "https://www.freecodecamp.org",
    ),
    (
        "frontendmentor",
        "#334489",
        "icon-frontendmentor.svg",
        "https://www.frontendmentor.io",
    ),
    ("github", "#1A1A1A", "icon-github.svg", "https://www.github.com"),
    ("gitlab", "#EB4925", "icon-gitlab.svg", "https://www.gitlab.com"),
    ("hashnode", "#0330D1", "icon-hashnode.svg", "https://www.hashnode.com"),
    ("linkedin", "#2D68FF", "icon-linkedin.svg", "https://www.linkedin.com"),
    (
        "stackoverflow",
        "#EC7100",
        "icon-stackoverflow.svg",
        "https://www.stackoverflow.com",
    ),
    ("twitch", "#EE3FC8", "icon-twitch.svg", "https://www.twitch.tv"),
    ("twitter", "#43B7E9", "icon-twitter.svg", "https://www.twitter.com"),
    ("youtube", "#EE3939", "icon-youtube.svg", "https://www.youtube.com"),
]


class Command(BaseCommand):
    help = "Init the app Platform models"

    def handle(self, *args, **options):

        # Delete existing Platforms (inc SVGs)
        self.stdout.write("Deleting existing Platform models")
        Platform.objects.all().delete()

        self.stdout.write("Deleting existing Platform SVGs")
        svg_folder = Path("media/platform-svgs")
        for file in svg_folder.iterdir():
            if file.is_file() and file.name != ".gitkeep":
                file.unlink()

        # Create new instances
        self.stdout.write("Creating Platform models")
        stored_icons_dir = Path("links/assets")
        platform_count = 0

        for name, color, icon_filename, origin in PLATFORMS:
            platform = Platform(
                platform_name=name, platform_color=color, platform_origin=origin
            )
            platform.save()
            self.stdout.write(f"{name} created")
            platform_count += 1

            icon_path = Path(stored_icons_dir) / icon_filename

            with icon_path.open("rb") as file:
                platform.platform_icon.save(
                    icon_filename, File(file, name=icon_filename), save=True
                )

        self.stdout.write(f"Created {platform_count} platforms")
