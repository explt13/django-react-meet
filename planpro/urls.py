from django.urls import path
from . import views
from .views import GetCsrf, UserLogin, UserRegister, UserLogout, CheckAuth, UserView, UsersView, SendFriendRequest, FriendsView, EventSentView, EventRecievedView, MailView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('csrftoken', GetCsrf.as_view(), name='csrftoken'),
    path('checkauth', CheckAuth.as_view(), name='checkauth'),
    path('login', UserLogin.as_view(), name='login'),
    path('register', UserRegister.as_view(), name='register'),
    path('logout', UserLogout.as_view(), name='logout'),
    path('user/<str:username>', UserView.as_view(), name='user'),
    path('user/<str:username>/friends', FriendsView.as_view(), name='friends'),
    path('user/<str:username>/friends/<str:delete_username>', FriendsView.as_view(), name='friends_delete'),
    path('user/<str:username>/friendship/<int:friendshipID>', FriendsView.as_view(), name='friendsip_response'),
    path('friend_request', SendFriendRequest.as_view(), name='friend_request'),

    path('users', UsersView.as_view(), name='users'),
    path('event/sent', EventSentView.as_view(), name='event_sent'),
    path('event/recieved', EventRecievedView.as_view(), name='event_recieved'),
    path('event/reject', EventRecievedView.as_view(), name='event_reject'),
    path('event/accept', EventRecievedView.as_view(), name='event_accept'),
    path('event/cancel', EventSentView.as_view(), name='event_cancel'),

    path('mail/recieved', MailView.as_view(), name='mail_recieved'),
    path('mail/read', MailView.as_view(), name='mail_read'),
    path('mail/<str:method>', MailView.as_view(), name='mail_delete'),
    path('mail/<str:method>', MailView.as_view(), name='mail_clear')



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)