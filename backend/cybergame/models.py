from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Scenario(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    threat_type = models.CharField(max_length=50)  # e.g., 'phishing', 'ransomware', 'ddos'
    difficulty = models.IntegerField(choices=[(1, 'Débutant'), (2, 'Intermédiaire'), (3, 'Avancé')])
    time_limit = models.IntegerField(help_text='Temps limite en secondes')
    created_at = models.DateTimeField(auto_now_add=True)
    scenario_type = models.CharField(max_length=50, choices=[
        ('PHISHING', 'Phishing Attack'),
        ('DDOS', 'DDoS Attack'),
        ('RANSOMWARE', 'Ransomware Attack')
    ])
    environment_config = models.JSONField(default=dict)  # Store 3D environment settings
    learning_objectives = models.JSONField(default=list)
    recommended_time = models.IntegerField(help_text='Recommended time in minutes')
    
    def __str__(self):
        return self.title

class Challenge(models.Model):
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE, related_name='challenges')
    question = models.TextField()
    correct_answer = models.TextField()
    hints = models.JSONField(default=list)
    points = models.IntegerField()
    interaction_type = models.CharField(max_length=50)  # e.g., 'terminal', 'email', 'network'
    success_message = models.TextField()
    failure_message = models.TextField()
    learning_points = models.JSONField(default=list)
    
    def __str__(self):
        return f"Challenge for {self.scenario.title}"

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    time_taken = models.IntegerField(null=True)  # en secondes
    completed_at = models.DateTimeField(null=True)
    
    class Meta:
        unique_together = ['user', 'scenario']

class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='achievements/')
    required_score = models.IntegerField()
    
    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'achievement']

class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill_name = models.CharField(max_length=100)
    level = models.IntegerField(default=1)
    experience = models.IntegerField(default=0)

class Leaderboard(models.Model):
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    completion_time = models.IntegerField()
    completed_at = models.DateTimeField(auto_now_add=True)
