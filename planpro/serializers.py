from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import User, Friendship, Event, Event_Recipient, Mail, Interest, Event_Archived
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.exceptions import ObjectDoesNotExist

class UserRegisterSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = User
		fields = ('pk', 'password', 'username', 'first_name', 'last_name', 'about', 'email', 'profile_pic')
		extra_kwargs = {
			'password': {'write_only': True}
		}

	
	default_error_messages = {
		'mismatch': 'passwords must match',
		'invalid_length': 'password must be at least 8 characters',
	}


	
	def validate_password(self, value):
		confirmation = self.initial_data.get('confirmation')
		if value != confirmation:
			self.fail('mismatch')
			# raise ValidationError('passwords must match') alternative
		if len(value) < 8:
			self.fail('invalid_length')

		return value
	def to_internal_value(self, data):
        # If profile_pic is an empty string, use the default value
		if 'profile_pic' in data and data['profile_pic'] == '':
			data['profile_pic'] = 'images/default.png'

		return super().to_internal_value(data)


	def create(self, validated_data):
		return User.objects.create(
			username=validated_data['username'],
			password=validated_data['password'],
			first_name=validated_data['first_name'],
			last_name=validated_data['last_name'],
			email=validated_data['email'],
			profile_pic=validated_data.get('profile_pic', 'images/default.png')
			)


class UserLoginSerializer(serializers.Serializer):
	
	def check_user(self, data):
		user = authenticate(username=data['username'], password=data['password'])
		if not user:
			raise serializers.ValidationError('username or password are incorrect')
		return user


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile_pic', 'about')

	def validate_profile_pic(self, value):
		if isinstance(value, InMemoryUploadedFile):
			return value
		return self.instance.profile_pic

	def update(self, instance, validated_data):
		instance.about = validated_data.get('about', instance.about)
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
		fields = ('username', 'first_name', 'last_name')


class Event_RecipientSerializer(serializers.ModelSerializer):
	recipient = UserForEventSerializer(read_only=True)
	
	class Meta:
		model = Event_Recipient
		fields = ('recipient', 'status')

	def to_representation(self, instance):
		representation = super().to_representation(instance)
		recipient_representaion = representation.pop('recipient')
		representation['username'] = recipient_representaion['username']
		return representation


class EventSerializer(serializers.ModelSerializer):
	requester = UserForEventSerializer(read_only=True)
	# recipients = serializers.SerializerMethodField()
	time = serializers.TimeField() # could format here insted of using properties in model # Because it's not a model field, it needs to be added explicitly to the serializer class
	class Meta:
		model = Event
		fields = ('event_id', 'requester', 'initial_recipients', 'category', 'event_id', 'latitude', 'longitude', 'text', 'date', 'time', 'sent', 'marker_id', 'icon')

	# def get_recipients(self, instance):
	# 	event_recipients = Event_Recipient.objects.filter(event=instance)
	# 	return Event_RecipientSerializer(event_recipients, many=True).data

	
	def create(self, validated_data):
		return Event.objects.create(**validated_data)


class EventArchivedSerializer(serializers.ModelSerializer):
	# requester = UserForEventSerializer(read_only=True) # will ignore when post methpod
	time = serializers.TimeField()
	class Meta:
		model = Event_Archived
		fields = ('event_id', 'initial_requester', 'initial_recipients', 'category', 'event_id', 'text', 'date', 'time', 'sent', 'icon')


class MailSerializer(serializers.ModelSerializer):
	sender = UserSerializer(read_only=True)
	recipients = UserSerializer(read_only=True, many=True)
	formatted_sent = serializers.SerializerMethodField()
	
	class Meta:
		model = Mail
		fields = ('id', 'sender', 'recipients', 'header', 'content', 'sent', 'category', 'formatted_sent', 'event_date')

	def get_formatted_sent(self, obj):
		return obj.format_sent()


class EventQtySerializer(serializers.Serializer):
	category = serializers.CharField()
	qty = serializers.IntegerField()


	def to_representation(self, instance):
		representation = super().to_representation(instance)
		category = representation.pop('category')
		representation['name'] = category.capitalize()
		representation['value'] = category
		return representation


class InterestSerializer(serializers.ModelSerializer): 
	class Meta:
		model = Interest
		fields = ('name', )


	def to_representation(self, instance):
		representation = super().to_representation(instance)
		name = representation.pop('name')
		return name


class InterestListSerializer(serializers.ListSerializer):
	child = serializers.CharField() # child is list item


