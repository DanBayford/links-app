import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    profile_image = models.FileField(upload_to="profile-images/", blank=True)
    is_test_user = models.BooleanField(
        default=False
    )  # Use to identify test user even if email edited

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()  # type: ignore

    def __str__(self):
        return self.email

    @property
    def formatted_name(self):
        if self.first_name and self.last_name:
            formatted_name = f"{self.first_name} {self.last_name}"
        elif self.first_name:
            formatted_name = self.first_name
        elif self.last_name:
            formatted_name = self.last_name
        else:
            formatted_name = ""

        return formatted_name
