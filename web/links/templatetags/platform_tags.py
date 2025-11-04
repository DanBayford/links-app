from django import template
from links.data import PLATFORMS

register = template.Library()
PLATFORM_LABELS = dict(PLATFORMS)

@register.filter
def platform_label(platform_identifier):
    """
    Attempts to look up against dictionary, defaults to provided identifier
    """
    x = PLATFORM_LABELS.get(platform_identifier, None)
    print('x', x)
    return PLATFORM_LABELS.get(platform_identifier, platform_identifier)