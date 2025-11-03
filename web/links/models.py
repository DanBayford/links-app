import uuid
from urllib.parse import urlsplit
from django.db import models
from django.core.validators import RegexValidator, FileExtensionValidator, URLValidator
from users.models import CustomUser
from .data import PLATFORMS, PLATFORM_REGEXES
from django.core.exceptions import ValidationError

HEX_COLOR_VALIDATOR = RegexValidator(
    regex=r"^#(?:[0-9a-fA-F]{6})$",
    message="Enter a valid hex color like #RRGGBB.",
    code="invalid_hex_color",
)

SVG_EXTENSION_VALIDATOR = FileExtensionValidator(
    allowed_extensions=["svg"],
    message="File must be an .svg.",
)

ORIGIN_VALIDATOR = RegexValidator(
    # Allows for http/s, hyphens in domain and port numbers
    regex=r"^(https?):\/\/(www\.)?[A-Za-z0-9.-]+(?::\d+)?$",
    message="Please enter a valid origin",
    code="invalid_platform_origin",
)


def normalise_url(url: str):
    """Return (scheme, host, port) with default ports normalized (http=80, https=443)."""
    p = urlsplit(url)
    scheme = (p.scheme or "").lower()
    host = (p.hostname or "").lower()
    port = p.port
    if port is None:
        port = 443 if scheme == "https" else 80 if scheme == "http" else None
    return scheme, host, port


class Platform(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    platform_name = models.CharField(max_length=255)
    platform_color = models.CharField(max_length=7, validators=[HEX_COLOR_VALIDATOR])
    platform_icon = models.FileField(
        upload_to="platform-svgs/",
        validators=[SVG_EXTENSION_VALIDATOR],
    )
    platform_origin = models.CharField(
        max_length=255,
        validators=[ORIGIN_VALIDATOR],
        help_text="Origin for platform (ie https://www.github.com)",
    )

    def __str__(self) -> str:
        return f"{self.platform_name}"

    def matches_platform_origin(self, link: str) -> tuple[bool, str | None]:
        URLValidator(schemes=["http", "https"])(link)

        # Get scheme, host and port into tuples
        platform_scheme, platform_host, platform_port = normalise_url(
            self.platform_origin
        )
        link_scheme, link_host, link_port = normalise_url(link)

        # Confirm schemes match
        if link_scheme != platform_scheme:
            return False, f"Link URL must use {platform_scheme.upper()}."

        # Confirm hosts match including optional www
        if link_host == platform_host:
            # Exact match
            pass
        elif f"www.{link_host}" == platform_host:
            # Allow omitted 'www' on url
            pass
        else:
            msg = f"Host must be {platform_host}"
            if link_host.endswith("." + platform_host):
                msg += "(No subdomains allowed)"
            return False, msg + "."

        # Confirm ports match
        if link_port != platform_port:
            return False, f"Port {link_port} not allowed (expected {platform_port})."

        return True, None

    def clean(self):
        super().clean()
        file = self.platform_icon
        if file and hasattr(file, "read"):
            pos = file.tell()
            try:
                head = file.read(4096).decode(errors="ignore")
                if "<svg" not in head:
                    raise ValidationError(
                        {"platform_icon": "Uploaded file does not look like an SVG."}
                    )
            finally:
                file.seek(pos)


class Link(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4)
    platform = models.ForeignKey(Platform, on_delete=models.CASCADE)
    link_url = models.URLField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="links")
    position = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user.email} - {self.platform.platform_name}"

    def clean(self):
        super().clean()

        # Check self_url starts with platform origin
        ok, err = (
            self.platform.matches_platform_origin(self.link_url)
            if self.platform
            else (False, "Platform is required.")
        )
        if not ok:
            raise ValidationError({"link_url": err if err else "Something went wrong"})

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
