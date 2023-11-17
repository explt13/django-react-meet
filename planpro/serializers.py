from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import User

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = '__all__'

	def create(self, clean_data):
		if (clean_data['password'] != clean_data['confirmation']):
			raise serializers.ValidationError({'password': 'passwords must match'})
		user_obj = User.objects.create_user(username=clean_data['username'], email=clean_data['email'], password=clean_data['password'])
		user_obj.save()
		return user_obj


class UserLoginSerializer(serializers.Serializer):
	
	def check_user(self, data):
		user = authenticate(username=data['username'], password=data['password'])
		if not user:
			raise serializers.ValidationError('username or password are incorrect')
		return user


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username', 'email', 'first_name', 'last_name')

	def update(self, instance, validated_data):
		instance.username = validated_data.get('username', instance.username)
		instance.first_name = validated_data.get('first_name', instance.first_name)
		instance.last_name = validated_data.get('last_name', instance.last_name)
		instance.save()
		return instance # if i want to get model object after updating