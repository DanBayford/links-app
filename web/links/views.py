from django.views.generic import TemplateView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from users.models import CustomUser

class LinksEditView(LoginRequiredMixin, TemplateView):
  template_name = "links/editLinks.html"

class LinksPreviewView(DetailView):
  template_name = 'links/previewLinks.html'
  model = CustomUser
