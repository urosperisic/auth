# accounts/urls.py

from django.urls import path

from .views import CSRFView, LoginView, LogoutView, MeView, RegisterView

urlpatterns = [
    path("auth/csrf/", CSRFView.as_view(), name="auth-csrf"),
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
]
