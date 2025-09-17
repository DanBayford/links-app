from django.urls import path
from .views import LinksEditView, LinksPreviewView

app_name = "links"

urlpatterns = [
    path("links/<uuid:pk>/edit", LinksEditView.as_view(), name="edit"),
    path(
        "links/<uuid:pk>/preview", 
        LinksPreviewView.as_view(), 
        name="preview"
    ),
]