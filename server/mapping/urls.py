from django.urls import path, re_path
from .views import *
urlpatterns = [
    path('coords/', get_coords, name='get-coords'),
    path('route/', get_route, name='get-route'),
    path('route_charging/', get_route_via_charging, name='get-route-charging'),
]