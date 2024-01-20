from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import(
UserRegisterSerializer,
UserLoginSerializer,
UserSerializer,
FriendshipSerializer,
EventSerializer,
MailSerializer,
EventQtySerializer,
InterestSerializer,
InterestListSerializer,
EventArchivedSerializer
)
from rest_framework import permissions, status
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token
from .models import User, Friendship, Event, Event_Recipient, Mail, Interest, Event_Archived
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, F, Sum, Q
from . import models
from itertools import chain
from collections import defaultdict
from datetime import datetime
from django.db.models import Q
from django.contrib.auth.models import Group
from rest_framework.parsers import MultiPartParser

class GetCsrf(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request):
        csrftoken = get_token(request)
        return Response({'csrftoken': csrftoken})


class CheckAuth(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request):
        return Response({'auth': request.user.is_authenticated})


class CheckUsername(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, username):
        try:
            User.objects.get(username=username)
            return Response({'vacant': False})
        except ObjectDoesNotExist:
            return Response({'vacant': True}, status=status.HTTP_200_OK)

class UserLogin(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny, )
    # parser_classes = [MultiPartParser]
    def post(self, request):
        data = request.data
        serializer = UserRegisterSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(data)
            if user:
                login(request, user)
                base_group = Group.objects.get(name='Base User')
                user.groups.add(base_group)
                user.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    

class UserLogout(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    def post(self, request):
        logout(request)
        return Response('Logging out..',status=status.HTTP_200_OK)

class ProfileOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        
        # Return a tuple with a boolean and an error message (if any)
        if request.method == 'PATCH' and request.user == view.get_user():
            return True
        if request.method == 'GET': # not checking for perms
            return True

class UserView(APIView):
    permission_classes = (ProfileOwner, permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    def get_user(self):
        return User.objects.get(username=self.kwargs.get('username'))

    def get(self, request, username): #get user
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    
    def patch(self, request, username): #update user information
        data = request.data
        print(data)
        serializer = UserSerializer(request.user, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.update(request.user, serializer.validated_data) 
            return Response('Profile information has been updated', status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)


class UsersView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )

    def get(self, request): # get bunch of users
        data = request.query_params
        query = data.get('query')
        if query == '':
            return Response('Users not found', status=status.HTTP_400_BAD_REQUEST)
        queryset = User.objects.filter(Q(first_name__startswith=query) | Q(last_name__startswith=query))
        queryset = queryset.exclude(pk=request.user.pk)
        if not queryset:
            return Response('Users not found', status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    

class FriendsView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )

    def get(self, request, username):
        data = request.query_params
        user = User.objects.get(username=username)

        if data.get('get_friends'): #get all friends
            queryset = user.friends.all()
            serializer = UserSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        if data.get('get_sent_requests'): # get sent requests
            queryset = user.sent_requests.all()
            serializer = FriendshipSerializer(queryset, many=True, context={'serialize_recipient': True})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        if data.get('get_received_requests'): # get recivied requests
            queryset = user.received_requests.all()
            serializer = FriendshipSerializer(queryset, many=True, context={'serialize_requester': True})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request, username, friendshipID):
        friendship = Friendship.objects.get(pk=friendshipID)
        user = User.objects.get(username=username)
        data = request.data

        if data.get('action') == 'accept':
            user.friends.add(friendship.requester)
            friendship.delete()
            serializer = UserSerializer(friendship.requester)
            return Response(data={'alert': 'Friendship request accepted', 'user': serializer.data}, status=status.HTTP_200_OK)

        elif data.get('action') == 'reject':
            friendship.delete()
            return Response('Friendship request rejected', status=status.HTTP_200_OK)
        
        elif data.get('action') == 'cancel':
            friendship.delete()
            return Response('Friendship request canceled', status=status.HTTP_200_OK) 

        
    def delete(self, request, username, delete_username):
        user = User.objects.get(username=username)
        delete_user = User.objects.get(username=delete_username)
        user.received_events.filter(requester=delete_user).delete() # clear user's received events
        delete_user.received_events.filter(requester=user).delete() # clear delete_user's received events 
        user.friends.remove(delete_user)
        return Response('Friend has been deleted', status=status.HTTP_200_OK)
        

class SendFriendRequest(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    def post(self, request): # sent request
        data = request.data
        recipient = User.objects.get(username=data.get('username'))
        if request.user.friends.filter(username=recipient).exists():
            return Response('Already in friends list', status=status.HTTP_400_BAD_REQUEST)
        
        if not Friendship.objects.filter(requester=request.user, recipient=recipient, status='pending').exists():
            mail = Mail.objects.create(sender=request.user, header='Friends request', content=f'User {request.user.username} wants to be friedns', category='FRIENDS') 
            mail.recipients.add(recipient)
            Friendship.objects.create(requester=request.user, recipient=recipient, status='pending')
            serializer = UserSerializer(recipient)
            return Response(data={'alert': 'Friend request has been sent', 'user': serializer.data}, status=status.HTTP_200_OK)

        return Response('Friend request alreay sent', status=status.HTTP_409_CONFLICT)


class CustomEventPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET' and request.user.has_perm('planpro.view_event'):
            return True
        elif request.method == 'POST' and request.user.has_perm('planpro.add_event'):
            return True
        elif request.method == 'DELETE' and request.user.has_perm('planpro.delete_event'):
            return True
        elif (request.method == 'PUT' or request.method == 'PATCH') and request.user.has_perm('planpro.change_event'):
            return True
        else:
            return False

# from django.contrib.auth.mixins import PermissionRequiredMixin
class EventSentView(APIView):
    # permission_required = ('planpro.view_event', ) # for specific permission groups or permissions
    permission_classes = (CustomEventPermission, permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    

    def get(self, request):
        user = request.user    
        sent_events = user.sent_events.all()
        serializer = EventSerializer(sent_events, many=True)
        return Response(serializer.data)
    

    def post(self, request):
        data = request.data
        recipients = data.get('recipients')
        recipients_array = [recipient['username'] for recipient in recipients]
        recipients = User.objects.filter(username__in=recipients_array)
        
        if not recipients.exists(): return Response('At least one user must be chosen', status=status.HTTP_400_BAD_REQUEST)

        serializer = EventSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.validated_data['requester'] = request.user
            event = serializer.create(validated_data=serializer.validated_data)
            event.recipients.add(*recipients)
            event.set_initial_recipients()
            event.set_initial_requester()
            event.save()
            mail = Mail.objects.create(sender=request.user, header='Event request', content=data.get('text'), category='EVENTS')
            mail.recipients.add(*recipients)

            return Response('Event has been sent', status=status.HTTP_201_CREATED)
        return Response('Internal error', status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        try:
            data = request.query_params
            event = Event.objects.get(marker_id=data.get('marker_id'))
            accepted_recipients = User.objects.filter(event_recipient__event=event, event_recipient__status='ACCEPTED') # foreign keys and m2m lookups
            if accepted_recipients.exists(): # if there are users that accepted but requester deleted event then make archive copy                
                archived_event = Event_Archived()
                for field in event._meta.fields:
                    if field.name not in ['event_id', 'requester', 'marker_id', 'latitude', 'longitude']:
                        setattr(archived_event, field.name, getattr(event, field.name))
                setattr(archived_event, 'is_cancelled', True)
                archived_event.save()
                archived_event.users.add(*accepted_recipients)
            event.delete()
        except ObjectDoesNotExist:
            return Response('Event has been deleted', status=status.HTTP_200_OK)

        return Response('Event has been deleted', status=status.HTTP_200_OK)


class EventReceivedView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )

    def get(self, request):
        user = request.user
        events = user.received_events.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    
    def delete(self, request):
        data = request.query_params
        user = request.user
        event = Event.objects.get(marker_id=data.get('marker_id'))
        user.received_events.remove(event)

        for obj in event.initial_recipients:
            if obj.get('username') == user.username:
                obj['status'] = 'REJECTED'
        event.save()
        
        return Response('Event rejected', status=status.HTTP_200_OK)
    
    def patch(self, request):
        user = request.user
        data = request.data
        marker_id = data.get('marker_id')
        event = Event.objects.get(marker_id=marker_id)

        event_recipient = Event_Recipient.objects.get(event=event, recipient=user) # necessary cuz i use for frontend initial_recipients
        event_recipient.status = 'ACCEPTED' # <-
        event_recipient.save() # <-

        for obj in event.initial_recipients:
            if obj.get('username') == user.username:
                obj['status'] = 'ACCEPTED'
        event.save()

        return Response('Event accepted', status=status.HTTP_200_OK)


class EventRefreshView(APIView):
    authentication_classes = (SessionAuthentication, )
    permission_classes = (permissions.IsAuthenticated, )
    def get(self, request):
        sent_events = request.user.sent_events.all() #filter lte__
        received_events = request.user.received_events.all()
        for event in list(chain(sent_events, received_events)):
            if datetime.strptime(datetime.strftime(event.date, '%Y-%m-%d') + 'T' + event.time, '%Y-%m-%dT%H:%M') < datetime.now():
                archived_event = Event_Archived()
                for field in event._meta.fields:
                    if field.name not in ['event_id', 'requester', 'marker_id', 'latitude', 'longitude']:
                        setattr(archived_event, field.name, getattr(event, field.name))
                setattr(archived_event, 'is_deprecated', True)
                archived_event.save()
                archived_event.users.add(event.requester)
                accepted_recipients = User.objects.filter(event_recipient__event=event, event_recipient__status='ACCEPTED')
                if accepted_recipients.exists(): # if there are users that accepted but requester deleted event then make archive copy                
                    archived_event.users.add(*accepted_recipients)
                event.delete()

        return Response('Events has been refreshed', status=status.HTTP_200_OK)


class ArchivedEvents(APIView):
    authentication_classes = (SessionAuthentication, )
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request):
        archived_events = request.user.archived_events.all()
        
        serializer = EventArchivedSerializer(archived_events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request):
        archived_events = request.user.archived_events.all()
        for archived_event in archived_events:
            archived_event.users.remove(request.user)
            if not archived_event.users.exists():
                archived_event.delete()
        return Response('Archive has been cleared', status=status.HTTP_200_OK)

class EventQtyView(APIView):
    permission_classes=(permissions.IsAuthenticated,)
    authentication_classes=(SessionAuthentication, )
    def get(self, request):
        
        se_qs = list(Event.objects.filter(requester_id=request.user).values('category').annotate(qty=Count('category')))
        re_qs = list(Event.objects.filter(recipients=request.user).values('category').annotate(qty=Count('category')))
        category_sums = defaultdict(int)

        for entry in se_qs + re_qs:
            category_sums[entry['category']] += entry['qty']


        result_list = [{'category': category, 'qty': qty} for category, qty in category_sums.items()]
        serializer = EventQtySerializer(result_list, many=True)
        return Response(serializer.data)


class MailView(APIView):
    permission_classes=(permissions.IsAuthenticated,)
    authentication_classes=(SessionAuthentication, )
    def get(self, request):
        data = request.query_params
        if data.get('qty'):
            return Response(request.user.mail_recipient_set.filter(is_read=False).count())
        received_emails = request.user.received_emails.all()
        serializer = MailSerializer(received_emails, many=True)
        return Response(serializer.data)
    
    def patch(self, request):
        request.user.mail_recipient_set.all().update(is_read=True)
        return Response('Mail has been read', status=status.HTTP_200_OK)

    def delete(self, request, method):
        if method == 'delete':
            email_id = request.query_params.get('email_id')
            mail = Mail.objects.get(pk=email_id)
            request.user.received_emails.remove(mail)
            if not mail.recipients.exists():
                mail.delete()
            return Response('Email has been deleted', status=status.HTTP_200_OK)
        elif method == 'clear':
            emails = request.user.received_emails.all() # if there is no recipients anymore?
            for email in emails:
                request.user.received_emails.remove(email)
                if not email.recipients.exists():
                    email.delete()

            return Response('Mail has been cleared', status=status.HTTP_200_OK)


class InterestView(APIView):
    permission_classes=(permissions.IsAuthenticated,)
    authentication_classes=(SessionAuthentication, )

    def get(self, request, username):
        user = User.objects.get(username=username)
        interests = user.interests.all()
        serializer = InterestSerializer(interests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
         # assuming array
        serializer = InterestListSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            interests_arr = serializer.validated_data
            interests_qs = Interest.objects.filter(name__in=interests_arr)
            excluded_qs = request.user.interests.exclude(name__in=interests_arr)
            request.user.interests.remove(*excluded_qs)
            request.user.interests.add(*interests_qs)
            return Response('Interests has been updated', status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        