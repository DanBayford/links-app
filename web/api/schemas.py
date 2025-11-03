from typing import List
from ninja import ModelSchema, Schema  # type:ignore
from links.models import Link, Platform
from users.models import CustomUser

"""
Note that the schema parent class is different for existing models (ModelSchema)
and the request body for a new model instance (Schema)
"""


class UserEditSchema(Schema):
    first_name: str | None = None
    last_name: str | None = None
    email: str


class CustomUserSchema(ModelSchema):
    class Meta:
        model = CustomUser
        fields = ("email", "first_name", "last_name", "profile_image")


class PlatformSchema(ModelSchema):
    class Meta:
        model = Platform
        fields = ("uuid", "platform_name", "platform_color", "platform_icon")


# Single Link instance
class LinkSchema(ModelSchema):
    platform: PlatformSchema

    class Meta:
        model = Link
        fields = ("uuid", "platform", "link_url", "position")


# List of Links
class LinkListSchema(Schema):
    links: List[LinkSchema]


class LinkCreateSchema(Schema):
    platform: str
    link_url: str


class LinkUpdateSchema(Schema):
    platform: str | None = None
    link_url: str | None = None
