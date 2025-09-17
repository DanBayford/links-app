from allauth.account.adapter import DefaultAccountAdapter  # type:ignore
from django.urls import reverse

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        return reverse("links:edit", kwargs={"pk": str(request.user.id)})

    def get_signup_redirect_url(self, request):
          return reverse("links:edit", kwargs={"pk": str(request.user.id)})
      