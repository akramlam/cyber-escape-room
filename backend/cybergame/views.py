import logging
from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Scenario, Challenge, UserProgress, Achievement, UserAchievement
from .serializers import (
    ScenarioSerializer, ChallengeSerializer, UserProgressSerializer,
    AchievementSerializer, UserAchievementSerializer
)

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """Get the current user's information."""
    logger.info(f"Get user info - User: {request.user.username}")
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    logger.info("Register attempt")
    logger.info(f"Request data: {request.data}")
    
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        logger.error("Missing required fields")
        return Response(
            {'error': 'Veuillez fournir un nom d\'utilisateur, un email et un mot de passe'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        logger.error(f"Username already exists - Username: {username}")
        return Response(
            {'error': 'Ce nom d\'utilisateur existe déjà'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        logger.error(f"Email already exists - Email: {email}")
        return Response(
            {'error': 'Cet email est déjà utilisé'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
    logger.info(f"User created - Username: {username}, Email: {email}")
    return Response({
        'message': 'Utilisateur créé avec succès',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    """
    API root endpoint that lists all available endpoints.
    """
    return Response({
        'scenarios': reverse('scenario-list', request=request, format=format),
        'user-info': reverse('user-info', request=request, format=format),
        'register': reverse('register', request=request, format=format),
        'token': reverse('token_obtain_pair', request=request, format=format),
        'token-refresh': reverse('token_refresh', request=request, format=format),
        'achievements': reverse('achievement-list', request=request, format=format),
    })

class ScenarioViewSet(viewsets.ModelViewSet):
    queryset = Scenario.objects.all()
    serializer_class = ScenarioSerializer
    permission_classes = [permissions.IsAuthenticated]  # Explicitly require authentication
    
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            logger.info(f"Found scenario - ID: {instance.id}")
            
            serializer = self.get_serializer(instance)
            data = serializer.data
            
            # Get user progress if exists
            progress = UserProgress.objects.filter(user=request.user, scenario=instance).first()
            if progress:
                logger.info(f"Found user progress - ID: {progress.id}")
                data['user_progress'] = UserProgressSerializer(progress).data
            
            return Response(data)
            
        except Scenario.DoesNotExist:
            logger.error(f"Scenario not found - ID: {kwargs.get('pk')}")
            return Response(
                {'error': 'Scenario not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error retrieving scenario: {str(e)}")
            return Response(
                {'error': f'Error retrieving scenario: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Listing scenarios - Count: {len(serializer.data)}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error listing scenarios: {str(e)}")
            return Response(
                {'error': f'Error listing scenarios: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        logger.info(f"Start scenario - User: {request.user.username}, Scenario ID: {pk}")
        try:
            scenario = self.get_object()
            logger.info(f"Found scenario - ID: {scenario.id}")
            user = request.user
            
            # Create or get user progress
            progress, created = UserProgress.objects.get_or_create(
                user=user,
                scenario=scenario,
                defaults={
                    'score': 0,
                    'completed': False,
                    'time_taken': 0
                }
            )
            
            logger.info(f"User progress - ID: {progress.id}, Created: {created}")
            serializer = UserProgressSerializer(progress)
            return Response({
                'message': 'Scenario started successfully',
                'progress': serializer.data
            })
        except Exception as e:
            logger.error(f"Error starting scenario: {str(e)}")
            return Response(
                {'detail': f'Error starting scenario: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]  # Explicitly require authentication
    
    def get_queryset(self):
        logger.info(f"Get user progress - User: {self.request.user.username}")
        return UserProgress.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def complete_challenge(self, request, pk=None):
        logger.info(f"Challenge completion attempt - User: {request.user.username}, Progress ID: {pk}")
        logger.info(f"Request data: {request.data}")
        
        try:
            progress = self.get_object()
            logger.info(f"Found progress object: {progress.id} for scenario: {progress.scenario.id}")
            
            challenge_id = request.data.get('challenge_id')
            answer = request.data.get('answer', '').strip().lower()
            
            try:
                challenge = Challenge.objects.get(id=challenge_id, scenario=progress.scenario)
                logger.info(f"Found challenge: {challenge.id}")
                logger.info(f"Comparing answers - Submitted: {answer}, Correct: {challenge.correct_answer.strip().lower()}")
                
                if answer == challenge.correct_answer.strip().lower():
                    logger.info("Answer is correct!")
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
                    logger.info("Answer is incorrect")
                    return Response({'success': False, 'message': 'Incorrect answer'})
                    
            except Challenge.DoesNotExist:
                logger.error(f"Challenge not found - ID: {challenge_id}")
                return Response(
                    {'error': 'Challenge not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            logger.error(f"Error in complete_challenge: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _check_achievements(self, user, score):
        logger.info(f"Check achievements - User: {user.username}, Score: {score}")
        achievements = Achievement.objects.filter(required_score__lte=score)
        for achievement in achievements:
            UserAchievement.objects.get_or_create(user=user, achievement=achievement)

class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]  # Explicitly require authentication
    
    @action(detail=False, methods=['get'])
    def user_achievements(self, request):
        logger.info(f"Get user achievements - User: {request.user.username}")
        user_achievements = UserAchievement.objects.filter(user=request.user)
        serializer = UserAchievementSerializer(user_achievements, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def test_connection(request):
    logger.info("Test connection")
    return Response({
        "message": "API is working!",
        "timestamp": timezone.now().isoformat()
    })
