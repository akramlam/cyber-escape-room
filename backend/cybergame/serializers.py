from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Scenario, Challenge, UserProgress, Achievement, UserAchievement

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'question', 'hints', 'points']

class ScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scenario
        fields = [
            'id', 'title', 'description', 'threat_type', 
            'difficulty', 'time_limit', 'created_at'
        ]

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['id', 'completed', 'score', 'time_taken', 'completed_at']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ('id', 'name', 'description', 'icon', 'required_score')

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = ('id', 'user', 'achievement', 'earned_at')
