from django.http import HttpResponse

def healthcheck(request):
    return HttpResponse('ok', status=200)