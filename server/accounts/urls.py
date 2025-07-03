from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('verify/<str:token>/', views.verify_email, name='verify_email'),
    path('profile/', views.user_profile, name='user_profile'),
]