from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

# Create your models here.

EVENT_CHOICES = (# do this,
    ('HEALTH', 'Health'),
    ('EDUCATION', 'Education'),
    ('DINNER', 'Dinner'),
    ('BAR', 'Bar'),
    ('LEISURE', 'Leisure'),
    ('RELAXATION', 'Relaxation'),
    ('HOLIDAY', 'Holiday'),
    ('WORK', 'Work'),
    ('TRAVEL', 'Travel'),
    ('SHOPING', 'Shoping')
)

STATUS_CHOICES = (
    ('PENDING', 'Pending'),
    ('ACCEPTE', 'Accepted'),
    ('REJECTED', 'Rejected')
)


class User(AbstractUser):
    alphanumeric_validator = RegexValidator(
        r'^[0-9a-zA-Z]*$',
        'Only alphanumeric characters are allowed for the username.'
    )
    first_name = models.CharField(max_length=46, null=False, blank=False)
    last_name = models.CharField(max_length=46, null=False, blank=False)
    username= models.CharField(max_length=16, unique=True, null=False, blank=False, validators=[alphanumeric_validator])
    email = models.EmailField(max_length=64, null=False, blank=False)
    about = models.CharField(max_length=256, null=True, blank=True)
    profile_pic = models.ImageField(upload_to='images/', default='images/default.png')
    friends = models.ManyToManyField('self', blank=True)

class Friendship(models.Model):
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recieved_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    friendship_id = models.AutoField(primary_key=True)


class Event(models.Model): # split in two?m

    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_events')
    recipients = models.ManyToManyField(User, related_name='recieved_events', through='Event_Recipient') # all users events
    category = models.CharField(max_length=20, choices=EVENT_CHOICES, null=False)
    latitude = models.FloatField(null=False)
    longitude = models.FloatField(null=False)
    text = models.CharField(max_length=256)
    time = models.CharField(max_length=13)
    sent = models.DateField(auto_now_add=True)
    marker_id = models.FloatField(null=False)
    event_id = models.AutoField(primary_key=True)
    icon = models.CharField(max_length=128)


class Event_Recipient(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE) # records where user is event_recipient
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)




class Mail(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_emails')
    recipients = models.ManyToManyField(User, related_name='recieved_emails', through='Mail_Recipient') # i could use another table for this if i needed more fields for it
    category = models.CharField(max_length=20, choices=[('FRIENDS', 'Friends'), ('EVENTS', 'Events')])
    header = models.CharField(max_length=32)
    content = models.CharField(max_length=250)
    sent = models.DateTimeField(auto_now_add=True)


    def format_sent(self):
        return self.sent.strftime('%Y-%m-%d at %H:%M')

class Mail_Recipient(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.ForeignKey(Mail, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)