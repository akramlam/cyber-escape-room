from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'scenarios', views.ScenarioViewSet, basename='scenario')

urlpatterns = [
    path('register/', views.register, name='register'),
    path('user-info/', views.get_user_info, name='user-info'),
] + router.urls
