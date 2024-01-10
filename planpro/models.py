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
    interests = models.ManyToManyField('Interest', related_name='in_users_interests', blank=True) # blank for forms if true the field is not required

    def __str__(self): # can be serialized using StringRelatedSerializer
        return f'{self.first_name}  {self.last_name}'

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
    date = models.DateField()
    _time = models.TimeField()
    sent = models.DateField(auto_now_add=True)
    marker_id = models.FloatField(null=False)
    event_id = models.AutoField(primary_key=True)
    icon = models.CharField(max_length=128)

    @property
    def time(self):
        return self._time.strftime('%H:%M')
    
    @time.setter
    def time(self, value):
        self._time = value


class Event_Recipient(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE) # records where user is event_recipient
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)

class Interest(models.Model):
    name = models.CharField(max_length=32, blank=False, null=False)


class Mail(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_emails')
    recipients = models.ManyToManyField(User, related_name='recieved_emails', through='Mail_Recipient') # i could use another table for this if i needed more fields for it
    category = models.CharField(max_length=20, choices=[('FRIENDS', 'Friends'), ('EVENTS', 'Events')])
    header = models.CharField(max_length=32)
    content = models.CharField(max_length=250)
    sent = models.DateTimeField(auto_now_add=True)
    event_date = models.DateTimeField(default=None, null=True)

    def format_sent(self):
        return self.sent.strftime('%Y-%m-%d at %H:%M')
    

class Mail_Recipient(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.ForeignKey(Mail, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)


