from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView
from django.views.static import serve as static_serve
from django.urls import path, include, re_path
from allauth.account.views import SignupView, LogoutView, LoginView  # type:ignore
from api.api import api


urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "login/",
        LoginView.as_view(
            template_name="allauth/login.html"
        ),  # success url configured in users/adapters.py
        name="account_login",
    ),
    path(
        "signup/",
        SignupView.as_view(template_name="allauth/signup.html"),
        name="account_signup",
    ),
    path(
        "confirm/",
        TemplateView.as_view(template_name="allauth/confirmLogout.html"),
        name="logout_confirm",
    ),
    path(
        "logout/",
        LogoutView.as_view(template_name="allauth/logout.html"),
        name="account_logout",
    ),  # logout URL set in base.py
    path("", include("health.urls")),
    path("", include("marketing.urls")),
    path("", include("links.urls")),
    path("api/", api.urls),
]

if settings.DEBUG:
    import debug_toolbar  # type: ignore

    urlpatterns = (
        [
            path("__debug__/", include(debug_toolbar.urls)),
            path("__reload__/", include("django_browser_reload.urls")),
        ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
        + urlpatterns
    )

else:
    urlpatterns = [
        # Django serve media from file system (inefficient but ok for demo app)
        re_path(r"^media/(?P<path>.*)$", static_serve, {"document_root": settings.MEDIA_ROOT}),
    ] + urlpatterns
