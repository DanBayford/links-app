import os

from .base import *

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")

DEBUG = bool(int(os.environ.get("DEBUG", default=0)))

# 'DJANGO_ALLOWED_HOSTS' should be a single string of hosts with a space between each.
# For example: 'DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]'
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(" ")

if ALLOWED_HOSTS == " ":
    raise RuntimeError("Environment variable ALLOWED_HOSTS is not set")

# Where to move static files via collectstatic for production web serving
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# Whitenoise static asset server config
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")

# Where to upload media (Docker volume)
MEDIA_ROOT = BASE_DIR / "mediafiles"

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# Security hardening

# Tell Django to trust the proxy’s HTTPS indication header
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Redirect http→https (works correctly as long as the proxy sets X-Forwarded-Proto)
SECURE_SSL_REDIRECT = True

# Secure cookies
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = False  # React useing on API

# CSRF (remember to include scheme!)
CSRF_TRUSTED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(" ")

# HSTS (enable once you’re confident HTTPS is correct)
# SECURE_HSTS_SECONDS = 31536000  # 1 year
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True

# Prevent browser meme checking
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"
