from django.contrib import admin
from .models import User, Friendship, Interest, Event
# Register your models here.


admin.site.register(User)
admin.site.register(Friendship)
admin.site.register(Interest)
admin.site.register(Event)