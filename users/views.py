from django.http import Http404
from rest_framework import generics, viewsets, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer, InterestMessageSerializer, ChatMessageSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import InterestMessage, ChatMessage

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({'user': {
            'id': self.user.id,
            'username': self.user.username,
            # add any other user fields you need
        }})
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Get the refresh token and access token
            refresh = CustomTokenObtainPairSerializer.get_token(user)
            access = refresh.access_token

            # Ensure tokens are returned as strings
            data = {
                'refresh': str(refresh),
                'access': str(access),
            }
            return Response(data, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all().values('id', 'username', 'email')
        return Response(users, status=status.HTTP_200_OK)

class InterestMessageListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        interest_messages = InterestMessage.objects.all()
        serializer = InterestMessageSerializer(interest_messages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = InterestMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InterestMessageDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return InterestMessage.objects.get(pk=pk)
        except InterestMessage.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        interest_message = self.get_object(pk)
        serializer = InterestMessageSerializer(interest_message)
        return Response(serializer.data)

    def put(self, request, pk):
        interest_message = self.get_object(pk)
        serializer = InterestMessageSerializer(interest_message, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        interest_message = self.get_object(pk)
        interest_message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AcceptInterestMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            interest_message = InterestMessage.objects.get(pk=pk)
            interest_message.status = 'accepted'
            interest_message.save()
            return Response({'status': 'accepted'}, status=status.HTTP_200_OK)
        except InterestMessage.DoesNotExist:
            return Response({'error': 'Interest message not found'}, status=status.HTTP_404_NOT_FOUND)

class RejectInterestMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            interest_message = InterestMessage.objects.get(pk=pk)
            interest_message.status = 'rejected'
            interest_message.save()
            return Response({'status': 'rejected'}, status=status.HTTP_200_OK)
        except InterestMessage.DoesNotExist:
            return Response({'error': 'Interest message not found'}, status=status.HTTP_404_NOT_FOUND)

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatMessageSerializer
