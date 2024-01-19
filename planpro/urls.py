from django.urls import path
from .views import(
GetCsrf,
UserLogin,
UserRegister,
UserLogout,
CheckAuth,
UserView,
UsersView,
SendFriendRequest,
FriendsView,
EventSentView,
EventReceivedView,
MailView,
EventQtyView,
InterestView,
EventRefreshView,
ArchivedEvents,
CheckUsername
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('csrftoken', GetCsrf.as_view(), name='csrftoken'),
    path('checkauth', CheckAuth.as_view(), name='checkauth'),
    path('checkusername/<str:username>', CheckUsername.as_view(), name='checkusername'),
    
    path('login', UserLogin.as_view(), name='login'),
    path('register', UserRegister.as_view(), name='register'),
    path('logout', UserLogout.as_view(), name='logout'),
    path('user/<str:username>', UserView.as_view(), name='user'),
    path('user/<str:username>/update', UserView.as_view(), name='user_update'),
    path('user/<str:username>/friends', FriendsView.as_view(), name='friends'),
    path('user/<str:username>/friends/<str:delete_username>', FriendsView.as_view(), name='friends_delete'),
    path('user/<str:username>/friendship/<int:friendshipID>', FriendsView.as_view(), name='friendsip_response'),
    path('user/<str:username>/interest', InterestView.as_view(), name='user_interest_get'),
    path('interest', InterestView.as_view(), name='user_interest_post'),
    path('friend_request', SendFriendRequest.as_view(), name='friend_request'),
    path('users', UsersView.as_view(), name='users'),

    path('event/sent', EventSentView.as_view(), name='event_sent'),
    path('event/received', EventReceivedView.as_view(), name='event_received'),
    path('event/accept', EventReceivedView.as_view(), name='event_accept'),
    path('event/reject', EventReceivedView.as_view(), name='event_reject'),
    path('event/cancel', EventSentView.as_view(), name='event_cancel'),
    path('event/refresh', EventRefreshView.as_view(), name='event_refresh'),
    path('event/archived', ArchivedEvents.as_view(), name='event_archived'),
    path('event/qty', EventQtyView.as_view(), name='event_category_qty'),

    path('mail/received', MailView.as_view(), name='mail_received'),
    path('mail/read', MailView.as_view(), name='mail_read'),
    path('mail/<str:method>', MailView.as_view(), name='mail_delete'),
    path('mail/<str:method>', MailView.as_view(), name='mail_clear'),



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)