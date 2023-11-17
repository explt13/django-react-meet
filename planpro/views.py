from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from django.core.exceptions import ValidationError
from django.middleware.csrf import get_token


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

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data # get serialized data (string)
        serializer = UserSerializer(request.user, data=data, partial=True) # deserialization
        if serializer.is_valid(): # validation
            serializer.update(request.user, serializer.validated_data) # have access to validated_data after check is_valid
            return Response(serializer.data, status=status.HTTP_200_OK)