from typing import Any
from django.db.models.query import QuerySet
from django.views.generic import TemplateView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from users.models import CustomUser

# Template shell to load React
class LinksEditView(LoginRequiredMixin, TemplateView):
    template_name = "links/editLinks.html"


# This will be the public preview of the links (ie no auth) - React handles the dynamic preview
class LinksPreviewView(DetailView):
    template_name = "links/previewLinks.html"
    model = CustomUser
    context_object_name = "user"

    def get_queryset(self):
        return super().get_queryset().prefetch_related("links", "links__platform")


