from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    profile_pic = models.ImageField(upload_to='images/', default='images/default.png')
    friends = models.ManyToManyField('self', blank=True)

class Friendship(models.Model):
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recieved_requests')
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    friendship_id = models.AutoField(primary_key=True)


class Event(models.Model): # split in two?
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_events')
    recipients = models.ManyToManyField(User, related_name='recieved_events', through='Event_Recipient')
    latitude = models.FloatField(null=False)
    longitude = models.FloatField(null=False)
    text = models.CharField(max_length=256)
    time = models.CharField(max_length=13)
    sent = models.DateField(auto_now_add=True)
    marker_id = models.FloatField(null=False)
    event_id = models.AutoField(primary_key=True)


class Event_Recipient(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)



class Mail(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_emails')
    recipients = models.ManyToManyField(User, related_name='recieved_emails') # i could use another table for this if i needed more fields for it
    category = models.CharField(max_length=20, choices=[('friends', 'Friends'), ('events', 'Events')])
    header = models.CharField(max_length=32)
    content = models.CharField(max_length=250)
    sent = models.DateTimeField(auto_now_add=True)


    def format_sent(self):
        return self.sent.strftime('%Y-%m-%d at %H:%M')

