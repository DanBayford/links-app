import re
import os
import uuid
from ninja import NinjaAPI, Form, File  # type:ignore
from ninja.errors import HttpError  # type:ignore
from ninja.files import UploadedFile  # type:ignore
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.http import HttpRequest, HttpResponse, HttpResponseNotFound
from django.shortcuts import get_object_or_404
from links.data import PLATFORMS, PLATFORM_REGEXES
from links.models import Link, Platform
from users.models import CustomUser
from .schemas import (
    LinkSchema,
    LinkListSchema,
    LinkCreateSchema,
    LinkUpdateSchema,
    PlatformSchema,
    UserEditSchema,
)

api = NinjaAPI()


@api.get("/config")
def get_config(request):
    platforms = Platform.objects.all()
    serialised_platforms = [PlatformSchema.from_orm(p) for p in platforms]
    return {
        "platforms": serialised_platforms,
        "platform_lookup": PLATFORMS,
        "platform_regexes": PLATFORM_REGEXES,
    }


@api.get("/user")
def get_user(request):

    # Only return required fields - links on seperate API
    user = (
        CustomUser.objects.filter(email=request.user.email)
        .values("id", "first_name", "last_name", "email", "profile_image")
        .first()
    )

    if user is None:
        return HttpResponseNotFound("User not found")

    return user


@api.post("/user")
def update_user(
    request: HttpRequest,
    userData: UserEditSchema,
):
    try:
        user = CustomUser.objects.get(id=request.user.id)  # type:ignore
    except CustomUser.DoesNotExist:
        return HttpResponseNotFound("User not found")

    try:
        validate_email(userData.email)
    except DjangoValidationError:
        return HttpError(400, "You must have a valid email adress")

    user.first_name = userData.first_name or ""
    user.last_name = userData.last_name or ""
    user.email = userData.email

    user.save()

    return HttpResponse(status=204)


@api.post("/user/upload")
def upload_profile_picture(
    request: HttpRequest, profilePicture: UploadedFile = File(...)
):
    try:
        user = CustomUser.objects.get(id=request.user.id)  # type:ignore
    except CustomUser.DoesNotExist:
        return HttpResponseNotFound("User not found")

    # Clear original profile pic if exists
    if user.profile_image:
        user.profile_image.delete(save=False)

    # Rename file with UUID
    _, ext = os.path.splitext(profilePicture.name)
    new_filename = f"profile_{uuid.uuid4()}{ext}"

    # Save renamed file
    user.profile_image.save(new_filename, profilePicture, save=True)

    return HttpResponse(status=204)


@api.get("/links", response=list[LinkSchema])
def get_links(request: HttpRequest):
    user = request.user

    links = (
        Link.objects.select_related("platform").filter(user=user).order_by("position")
    )

    return links


@api.patch("/links/reorder", response={204: None})
def reorder_links(request, body: LinkListSchema):
    user = request.user
    uuids = [link.uuid for link in body.links]

    # Confirm submitted length matches stored length
    if Link.objects.filter(user=user).count() != len(uuids):
        raise HttpError(400, "Mismatched length")

    # Atomic to confirm all reordered or roll back transaction
    pos_map = {u: i for i, u in enumerate(uuids)}
    with transaction.atomic():
        updated_links = list(Link.objects.filter(user=user, uuid__in=uuids))  # type: ignore
        for link in updated_links:
            link.position = pos_map[link.uuid]
        Link.objects.bulk_update(updated_links, ["position"])

    # 204 No Content
    return 204, None


@api.post("/links", response=LinkSchema)
def create_link(request, link: LinkCreateSchema):
    user = request.user

    link_data = link.model_dump()  # pydantic method to create dict from req body
    platform_name = link_data["platform"]
    link_url = link_data["link_url"]

    # Confirm link url against platform regex
    platform_url_regex = PLATFORM_REGEXES[platform_name]
    if not re.match(platform_url_regex, link_url):
        return HttpError(400, "Incorrect platform URL")

    # Get platform model
    try:
        platform = Platform.objects.get(platform_name=platform_name)
    except Platform.DoesNotExist:
        return HttpError(400, "Platform not supported")

    # Work out current number of user links
    user_existing_link_count = Link.objects.filter(user=user).count()

    # Create new link
    link_instance = Link.objects.create(
        platform=platform,
        link_url=link_url,
        user=user,
        position=user_existing_link_count + 1,
    )

    return link_instance


@api.patch("/links/{uuid}", response=LinkSchema)
def update_link(request, uuid, link: LinkUpdateSchema):
    user = request.user
    link_data = link.model_dump()
    updated_platform = link_data["platform"]
    updated_link = link_data["link_url"]

    # Confirm Link URL against platform regex
    platform_url_regex = PLATFORM_REGEXES[updated_platform]
    if not re.match(platform_url_regex, updated_link):
        return HttpError(400, "Incorrect platform URL")

    # Confirm Platform
    try:
        platform = Platform.objects.get(platform_name=updated_platform)
    except Platform.DoesNotExist:
        return HttpError(400, "Platform does not exist")

    # Update Link instance
    link_instance = get_object_or_404(Link, uuid=uuid, user=user)

    try:
        link_instance.platform = platform
        link_instance.link_url = updated_link
        link_instance.save()
    except:
        return HttpError(400, "Error updating link")

    return link_instance


@api.delete("/links/{uuid}")
def delete_link(request, uuid: str):
    user = request.user
    link_instance = get_object_or_404(Link, uuid=uuid, user=user)
    link_instance.delete()
    return HttpResponse(status=204)
