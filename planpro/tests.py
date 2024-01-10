from django.test import TestCase
from .models import User, Interest
from .serializers import InterestSerializer, InterestListSerializer, Event
import datetime
import time


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
        # self.event = Event.objects.create(requester_id=self.user.pk, marker_id=1704573545639.4883, date='2024-01-07', time=datetime.datetime.strptime('02:40', '%H:%M'), text='sada', category= 'HEALTH', latitude=49.986552130506176, longitude= 82.59870533966212, icon='<i class="fas fa-plus-square LocationMarkers_health__-TpFM LocationMarkers_borderForIcon__lKa+z"></i>')
    
    def test_date(self):
        date1 = datetime.datetime.strptime('09-05-2024', '%d-%m-%Y').date()
        date2 = datetime.datetime.strptime('09-2024-11', '%d-%Y-%m').date()
        date3 = datetime.datetime.strptime('2024-01-07', '%Y-%m-%d').date()
        time1 = datetime.datetime.strptime('12:56', '%H:%M')
        print(time1)
        print('*********')
def outer(url_base='http://127.0.0.1:8000/') -> str:
    def inner(route):
        print(url_base + route)
    return inner
