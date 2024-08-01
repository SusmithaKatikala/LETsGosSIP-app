# backend/routing.py
from django.core.asgi import get_asgi_application
from django.urls import path, re_path
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from users.consumers import ChatConsumer
from users.routing import websocket_urlpatterns as users_websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            users_websocket_urlpatterns
            # Add other WebSocket URL routers here if needed
        )
    ),
})
