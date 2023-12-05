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
    recipient = models.ManyToManyField(User, related_name='recieved_events')
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_events')
    latitude = models.FloatField(null=False)
    longitude = models.FloatField(null=False)
    popup = models.CharField(max_length=256)
    sent = models.DateField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)
    marker_id = models.FloatField(null=False)
    event_id = models.AutoField(primary_key=True)


