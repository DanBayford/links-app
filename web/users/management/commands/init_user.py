import os
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from django.conf import settings
from links.models import Platform, Link
from users.models import CustomUser

# (platform_name, platform_color, platform_icon, platform_origin)
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
        "#FFFFFF",
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

TEST_USER_EMAIL = "dan@links.com"
TEST_USER_FIRST_NAME = "Dan"
TEST_USER_LAST_NAME = "Bayford"
TEST_USER_PASSWORD = "P@ssword!"


class Command(BaseCommand):
    help = "Reset the test user"

    def handle(self, *args, **options):

        # Confirm platforms have been initialised
        if not Platform.objects.exists():
            raise CommandError(
                'You must populate the Platforms table via "init_platforms" before running init_user'
            )

        # Delete existing test user (inc profile pic) and associated links if required
        test_user = None

        try:
            test_user = CustomUser.objects.get(is_test_user=True)
        except CustomUser.MultipleObjectsReturned:
            raise CommandError("Multiple test users found!")
        except CustomUser.DoesNotExist:
            self.stdout.write("No test user found")
            pass

        if test_user:
            # Delete associated profile image from file
            if test_user.profile_image:
                test_user.profile_image.delete(save=False)
            # Delete user instance
            test_user.delete()

        # Create new test user instance inc profile pic and links
        new_test_user = CustomUser.objects.create(
            email=TEST_USER_EMAIL,
            first_name=TEST_USER_FIRST_NAME,
            last_name=TEST_USER_LAST_NAME,
            is_test_user=True,
        )

        new_test_user.set_password(TEST_USER_PASSWORD)

        test_img_path = Path(settings.BASE_DIR) / "users" / "fixtures" / "dan.jpeg"

        with test_img_path.open("rb") as img:
            new_test_user.profile_image.save("dan.jpeg", File(img), save=True)

        # Create links to test user profiles
        Link.objects.create(
            platform=Platform.objects.get(platform_name="linkedin"),
            user=new_test_user,
            link_url="https://www.linkedin.com/in/dan-bayford-dev/",
            position=0,
        )

        Link.objects.create(
            platform=Platform.objects.get(platform_name="github"),
            user=new_test_user,
            link_url="https://github.com/DanBayford",
            position=1,
        )

        Link.objects.create(
            platform=Platform.objects.get(platform_name="stackoverflow"),
            user=new_test_user,
            link_url="https://stackoverflow.com/users/14130623/danb-web",
            position=2,
        )

        Link.objects.create(
            platform=Platform.objects.get(platform_name="facebook"),
            user=new_test_user,
            link_url="https://www.facebook.com/dan.bayford",
            position=3,
        )

        self.stdout.write(f"Created test user {new_test_user.email}")
