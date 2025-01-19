from django.contrib import admin
from .models import Scenario, Challenge, UserProgress, Achievement, UserAchievement

# Register your models here.

@admin.register(Scenario)
class ScenarioAdmin(admin.ModelAdmin):
    list_display = ('title', 'threat_type', 'difficulty', 'time_limit', 'created_at')
    list_filter = ('threat_type', 'difficulty')
    search_fields = ('title', 'description')

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('scenario', 'question', 'points')
    list_filter = ('scenario', 'points')
    search_fields = ('question', 'correct_answer')

@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'scenario', 'completed', 'score', 'time_taken', 'completed_at')
    list_filter = ('completed', 'scenario')
    search_fields = ('user__username',)

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'required_score')
    search_fields = ('name', 'description')

@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'earned_at')
    list_filter = ('achievement',)
    search_fields = ('user__username', 'achievement__name')
