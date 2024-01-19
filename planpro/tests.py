from django.test import TestCase
from .models import User, Interest, Event_Recipient, Event_Archived
from .serializers import InterestListSerializer, Event, User, EventSerializer
import datetime
import time
from rest_framework.serializers import OrderedDict

# Create your tests here.


class UserInterestTestCase(TestCase):
    def setUp(self):
        self.testUser = User.objects.create(username='TestCase', first_name='Test', password='12345')
        Interest.objects.create(name='BAR')
        Interest.objects.create(name='SPORT')
        Interest.objects.create(name='DINNER')
        # self.interests_list = [{"name":"BAR"}, {"name": "SPORT"},{"name": "SPORT"}]
        self.interests_list = ["BAR"]

    def test_user_have_interests(self):
        self.testUser = User.objects.get(username='TestCase')
        self.testUser.interests.add(Interest.objects.get(name='BAR'))
        self.testUser.interests.add(Interest.objects.get(name='SPORT'))
        serializer = InterestListSerializer(data=self.interests_list)
        if serializer.is_valid(raise_exception=True):
            interests_arr = serializer.validated_data
            interests = Interest.objects.filter(name__in=list(interests_arr))
            excluded_qs = self.testUser.interests.exclude(id__in=interests)
            self.testUser.interests.remove(*excluded_qs)
            self.testUser.interests.add(*interests)

        print('***')
        print('interests', interests)
        print(self.testUser.interests.all())
        print(Interest.objects.all())
        print('***')
        

        self.assertEqual(self.testUser.interests.count(), 1)
        self.assertEqual(Interest.objects.count(), 3)


class DateTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='TestCase', first_name='Test', password='12345')
    
    def test_date(self):
        date1 = datetime.datetime.strptime('09-05-2024', '%d-%m-%Y').date()
        date2 = datetime.datetime.strptime('09-2024-11', '%d-%Y-%m').date()
        date3 = datetime.datetime.strptime('2024-01-07', '%Y-%m-%d').date()
        time1 = datetime.datetime.strptime('12:56', '%H:%M')
        print(time1)
        print('*********')


class EventTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='TestCase', first_name='Test', password='12345')
        self.user2 = User.objects.create(username='TestCase2', first_name='Test2', password='12345')
        self.user3 = User.objects.create(username='TestCase3', first_name='Test3', password='12345')

        self.event = Event.objects.create(requester=self.user, **{
            "category": "DINNER",
            "event_id": 1,
            "latitude": 49.96171186915371,
            "longitude": 82.64352193503667,
            "text": "sdasd",
            "date": "2024-01-11",
            "time": "17:02",
            "sent": "2024-01-11",
            "marker_id": 1704965247196.5312,
            "icon": "<i class=\"fa-solid fa-mug-hot LocationMarkers_dinner__CMo4V LocationMarkers_borderForIcon__lKa+z\"></i>"
        })
    
    def test_event(self):
        print('********')
        self.event.recipients.add(self.user2, self.user3)
        self.event.set_initial_recipients()
        self.event.set_initial_requester()
        self.event.save()
        # er = self.user2.event_recipient_set.get(event_id=self.event)
        # self.event.save()
        # er.status = 'ACCEPTED'
        # er.save()

        # self.event.save()
        # self.user2.recieved_events.remove(self.event)
        # event_recipient = Event_Recipient.objects.get(event=self.event, recipient=self.user2)
        # event_recipient.delete()
        # print(self.event.initial_recipients)
        # print(self.event.event_recipient_set.filter(status='ACCEPTED'))
        # print(self.event.initial_recipients)
        # for obj in self.event.initial_recipients:
        #     if obj.get('username') == 'TestCase2':
        #         obj['status'] = 'ACCEPTED'
        # self.event.save()
        # serializer = EventSerializer(Event.objects.first())
        # print(serializer.data)
 
        

        self.u2ev = Event_Recipient.objects.get(event=self.event, recipient=self.user2)
        self.u2ev.status = 'ACCEPTED'
        self.u2ev.save()
        
        self.u3ev = Event_Recipient.objects.get(event=self.event, recipient=self.user3)
        self.u3ev.status = 'ACCEPTED'
        self.u3ev.save()

        # accepted_recipients = Event_Recipient.objects.filter(event_id=self.event, status='ACCEPTED')
        accepted_recipients = User.objects.filter(event_recipient__event=self.event, event_recipient__status='ACCEPTED')

        self.event.event_id = 45
    
        

        if accepted_recipients.exists(): # if there are users that accepted but requester deleted event then make archive copy                
            archived_event = Event_Archived()
            for field in self.event._meta.fields:
                if field.name not in ['event_id', 'requester']:
                    setattr(archived_event, field.name, getattr(self.event, field.name))
            setattr(archived_event, 'is_cancelled', True)
            archived_event.save()
            archived_event.users.add(self.event.requester, *accepted_recipients)
        self.event.delete()  
        
        
  
        print(archived_event.users.all())



        events = self.user2.archived_events.all()

        for event in events:
            event.users.remove(self.user2)

        print(self.user2.archived_events.all())
        print(self.user3.archived_events.all())
        print(archived_event)
