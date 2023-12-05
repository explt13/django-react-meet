from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import User, Friendship, Event

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = '__all__'

	def create(self, validated_data):
		if (validated_data['password'] != validated_data['confirmation']):
			raise serializers.ValidationError({'password': 'passwords must match'})
		user_obj = User.objects.create_user(username=validated_data['username'], email=validated_data['email'], password=validated_data['password'])
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
		fields = ('username', 'email', 'first_name', 'last_name', 'profile_pic')

	def update(self, instance, validated_data):
		instance.username = validated_data.get('username', instance.username)
		instance.first_name = validated_data.get('first_name', instance.first_name)
		instance.last_name = validated_data.get('last_name', instance.last_name)
		instance.profile_pic = validated_data.get('profile_pic', instance.profile_pic)
		instance.save()
		return instance # if i want to get model object after updating
	

class FriendshipSerializer(serializers.ModelSerializer):
    requester = UserSerializer()
    recipient = UserSerializer()
	
    class Meta:
        model = Friendship
        fields = ('friendship_id', 'requester', 'recipient', 'status')

    def to_representation(self, obj): #flattern data

        representation = super().to_representation(obj)
        recipient_representation = representation.pop('recipient')
        requester_reporesentation = representation.pop('requester')

        if self.context.get('serialize_recipient'):
            for key in recipient_representation:
                representation[key] = recipient_representation[key]

        if self.context.get('serialize_requester'):
            for key in requester_reporesentation:
                representation[key] = requester_reporesentation[key]

        return representation
	

class EventSerializer(serializers.ModelSerializer):
	requester = UserSerializer(read_only=True) # otherwise it will be treated like i want overwrite it so it will take validators on and all fields that requered as well
	recipient = UserSerializer(many=True, read_only=True) # inforamtion = requester: {username: 'someusername'} i even don't have to declare this field
	# I could pass user object using PrimaryKeyRelations but it'll be only id, there fully serialized information
	#requester = serializers.PrimaryKeyRelatedField(read_only=True)
	#recipient = serializers.PrimaryKeyRelatedField(read_only=True)


	class Meta:
		model = Event
		fields = ('requester', 'recipient', 'event_id', 'latitude', 'longitude', 'popup', 'sent', 'is_accepted', 'marker_id')

	def to_representation(self, instance):
		representation = super().to_representation(instance)
		requester_representation = representation.pop('requester')
		recipient_representation = representation.pop('recipient')
		recipient_username_array = list()

		representation['requester_username'] = requester_representation['username']
		for recipient in recipient_representation:
			recipient_username_array.append(recipient['username'])
		representation['recipient_username'] = recipient_username_array

		return representation
	
	def create(self, validated_data):
		return Event.objects.create(**validated_data)