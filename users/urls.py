from django.urls import path, include
from .views import RegisterView, LoginView, CustomTokenObtainPairView, UserListView, InterestMessageListCreateView, \
    InterestMessageDetailView, AcceptInterestMessageView, RejectInterestMessageView, ChatMessageViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'chat-messages', ChatMessageViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('', include(router.urls)),
    path('interest-messages/', InterestMessageListCreateView.as_view(), name='interest-message-list-create'),
    path('interest-messages/<int:pk>/', InterestMessageDetailView.as_view(), name='interest-message-detail'),
    path('interest-messages/<int:pk>/accept/', AcceptInterestMessageView.as_view(), name='accept-interest-message'),
    path('interest-messages/<int:pk>/reject/', RejectInterestMessageView.as_view(), name='reject-interest-message'),
]
