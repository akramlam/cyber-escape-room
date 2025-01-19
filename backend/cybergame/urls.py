from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'scenarios', views.ScenarioViewSet)
router.register(r'progress', views.UserProgressViewSet, basename='progress')
router.register(r'achievements', views.AchievementViewSet)

urlpatterns = [
    path('register/', views.register, name='register'),
    path('test/', views.test_connection, name='test-connection'),
    path('', include(router.urls)),
]
