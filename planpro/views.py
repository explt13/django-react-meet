from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, FriendshipSerializer, EventSerializer
from rest_framework import permissions, status
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token
from .models import User, Friendship, Event
from django.http import JsonResponse


class GetCsrf(APIView):
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request):
        csrftoken = get_token(request)
        return Response({'csrftoken': csrftoken})


class CheckAuth(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request):
        return Response({'auth': request.user.is_authenticated})


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
    
    def post(self, request):
        data = request.data
        serializer = UserRegisterSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(data)
            if user:
                login(request, user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    

class UserLogout(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    

class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )

    def get(self, request, username): #get user
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request): #update user information
        data = request.data 
        serializer = UserSerializer(request.user, data=data, partial=True)
        if serializer.is_valid():
            serializer.update(request.user, serializer.validated_data) 
            return Response(serializer.data, status=status.HTTP_200_OK)


class UsersView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )

    def get(self, request): # get bunch of users
        data = request.query_params
        if data.get('username') == '':
            return Response('Users not found', status=status.HTTP_400_BAD_REQUEST)
        queryset = User.objects.filter(username__startswith=data.get('username'))
        if not queryset:
            return Response('Users not found', status=status.HTTP_400_BAD_REQUEST)
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
        
        if data.get('get_recieved_requests'): # get recivied requests
            queryset = user.recieved_requests.all()
            serializer = FriendshipSerializer(queryset, many=True, context={'serialize_requester': True})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request, username, friendshipID):
        friendship = Friendship.objects.get(pk=friendshipID)
        user = User.objects.get(username=username)
        data = request.data

        if data.get('action') == 'accept':
            user.friends.add(friendship.requester)
            friendship.delete()
            return Response('friendship request accepted', status=status.HTTP_200_OK)

        elif data.get('action') == 'reject':
            friendship.delete()
            return Response('friendship request rejected', status=status.HTTP_200_OK)

        
    def delete(self, request, username, delete_username):
        user = User.objects.get(username=username)
        delete_user = User.objects.get(username=delete_username)
        user.friends.remove(delete_user)
        return Response('friend has been deleted')
        


class SendFriendRequest(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    def post(self, request): # sent request
        data = request.data
        recipient = User.objects.get(username=data.get('username'))
        if request.user.friends.filter(username=recipient).exists():
            return Response('already friends')
        
        if not Friendship.objects.filter(requester=request.user, recipient=recipient).exists():    
            Friendship.objects.create(requester=request.user, recipient=recipient, status='pending')
            return Response('Friend request has been sent')

        return Response('Friend request alreay sent')


class EventSentView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )

    def get(self, request):
        user = request.user
        sent_events = user.sent_events.all()
        serializer = EventSerializer(sent_events, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        recipient = User.objects.filter(username__in=data.get('recipient_username'))
        if not recipient.exists(): return Response('at least one user must be chosen')

        serializer = EventSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.validated_data['requester'] = request.user
            event = serializer.create(validated_data=serializer.validated_data)
            event.recipient.add(*recipient) # need model for confirmation?
            return Response('event has been sent')
        return Response(serializer.errors)
    
    def delete(self, request):
        data = request.query_params
        event = Event.objects.get(marker_id=data.get('marker_id'))
        event.delete()
        return Response('event has been deleted')


class EventRecievedView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )

    def get(self, request):
        user = request.user
        recieved_events = user.recieved_events.all()
        serializer = EventSerializer(recieved_events, many=True)
        return Response(serializer.data)
    
    def delete(self, request):
        data = request.query_params
        user = request.user
        event = Event.objects.get(marker_id=data.get('marker_id'))
        user.recieved_events.remove(event)
        if not event.recipient.exists():
            event.delete()
        return Response('event rejected')
    
    def patch(self, request):
        user = request.user
        data = request.data
        marker_id = data.get('marker_id')
        event = Event.objects.get(marker_id=marker_id)
        event.is_accepted = True
        event.save()
        return Response('event accepted')
