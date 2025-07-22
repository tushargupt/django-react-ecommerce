from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('user/', views.get_user_profile, name='user-profile'),
]