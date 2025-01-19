from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from .models import Scenario, Challenge, UserProgress, Achievement, UserAchievement
from .serializers import (
    ScenarioSerializer, ChallengeSerializer, UserProgressSerializer,
    AchievementSerializer, UserAchievementSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response(
            {'error': 'Veuillez fournir un nom d\'utilisateur, un email et un mot de passe'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Ce nom d\'utilisateur existe déjà'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Cet email est déjà utilisé'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response({
        'message': 'Utilisateur créé avec succès',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }, status=status.HTTP_201_CREATED)

class ScenarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Scenario.objects.all()
    serializer_class = ScenarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        scenario = self.get_object()
        user_progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            scenario=scenario
        )
        serializer = UserProgressSerializer(user_progress)
        return Response(serializer.data)

class UserProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def complete_challenge(self, request, pk=None):
        progress = self.get_object()
        challenge_id = request.data.get('challenge_id')
        answer = request.data.get('answer')
        
        try:
            challenge = Challenge.objects.get(id=challenge_id, scenario=progress.scenario)
        except Challenge.DoesNotExist:
            return Response({'error': 'Challenge not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if answer == challenge.correct_answer:
            progress.score += challenge.points
            if not progress.completed:
                progress.completed = True
                progress.completed_at = timezone.now()
                progress.time_taken = (progress.completed_at - progress.created_at).seconds
            progress.save()
            
            # Check for achievements
            self._check_achievements(request.user, progress.score)
            
            return Response({'success': True, 'score': progress.score})
        else:
            return Response({'success': False, 'message': 'Incorrect answer'})
    
    def _check_achievements(self, user, score):
        achievements = Achievement.objects.filter(required_score__lte=score)
        for achievement in achievements:
            UserAchievement.objects.get_or_create(user=user, achievement=achievement)

class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def user_achievements(self, request):
        user_achievements = UserAchievement.objects.filter(user=request.user)
        serializer = UserAchievementSerializer(user_achievements, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def test_connection(request):
    return Response({
        "message": "API is working!",
        "timestamp": timezone.now().isoformat()
    })
