from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import User, Friendship, Event, Event_Recipient, Mail

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
	

class UserForEventSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username', )


class Event_RecipientSerializer(serializers.ModelSerializer):
	recipient = UserForEventSerializer(read_only=True)
	
	class Meta:
		model = Event_Recipient
		fields = ('recipient', 'is_accepted')

	def to_representation(self, instance):
		representation = super().to_representation(instance)
		recipient_representaion = representation.pop('recipient')
		representation['username'] = recipient_representaion['username']
		return representation


class EventSerializer(serializers.ModelSerializer):
	requester = UserForEventSerializer(read_only=True)
	recipients = serializers.SerializerMethodField() 


	class Meta:
		model = Event
		fields = ('requester', 'recipients', 'event_id', 'latitude', 'longitude', 'text', 'time', 'sent', 'marker_id')

	def get_recipients(self, instance):
		event_recipients = Event_Recipient.objects.filter(event=instance)
		return Event_RecipientSerializer(event_recipients, many=True).data

	def to_representation(self, instance):
		representation = super().to_representation(instance)
		requester_representation = representation.pop('requester')
		representation['requester_username'] = requester_representation['username']
		return representation
	
	def create(self, validated_data):

		return Event.objects.create(**validated_data)
	

class MailSerializer(serializers.ModelSerializer):
	sender = UserSerializer(read_only=True)
	recipients = UserSerializer(read_only=True, many=True)
	formatted_sent = serializers.SerializerMethodField()
	
	class Meta:
		model = Mail
		fields = ('id', 'sender', 'recipients', 'header', 'content', 'sent', 'category', 'formatted_sent')

	def get_formatted_sent(self, obj):
		return obj.format_sent()
	
