from django.urls import path
from . import views
from .views import GetCsrf, UserLogin, UserRegister, UserLogout, CheckAuth, UserView

urlpatterns = [
    path('csrftoken/', GetCsrf.as_view(), name='csrftoken'),
    path('checkauth/', CheckAuth.as_view(), name='checkauth'),
    path('login/', UserLogin.as_view(), name='login'),
    path('register/', UserRegister.as_view(), name='register'),
    path('logout/', UserLogout.as_view(), name='logout'),
    path('user/', UserView.as_view(), name='user')
]