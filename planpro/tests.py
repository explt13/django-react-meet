from django.test import TestCase
from .models import User, Interest
from .serializers import InterestSerializer, InterestListSerializer
# Create your tests here.


class UserInterestTestCase(TestCase):
    def setUp(self):
        User.objects.create(username='TestCase', first_name='Test', password='12345')
        Interest.objects.create(name='BAR')
        Interest.objects.create(name='SPORT')
        Interest.objects.create(name='DINNER')
        # self.interests_list = [{"name":"BAR"}, {"name": "SPORT"},{"name": "SPORT"}]
        self.interests_list = ["BAR"]

    def test_user_have_interests(self):
        testUser = User.objects.get(username='TestCase')
        testUser.interests.add(Interest.objects.get(name='BAR'))
        testUser.interests.add(Interest.objects.get(name='SPORT'))
        serializer = InterestListSerializer(data=self.interests_list)
        if serializer.is_valid(raise_exception=True):
            interests_arr = serializer.validated_data
            interests = Interest.objects.filter(name__in=list(interests_arr))
            excluded_qs = testUser.interests.exclude(id__in=interests)
            testUser.interests.remove(*excluded_qs)
            testUser.interests.add(*interests)

        print('***')
        print('interests', interests)
        print(testUser.interests.all())
        print(Interest.objects.all())
        print('***')
        

        self.assertEqual(testUser.interests.count(), 1)
        self.assertEqual(Interest.objects.count(), 3)
    

