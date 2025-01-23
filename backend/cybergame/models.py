from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('IT', 'IT Professional'),
        ('NON_IT', 'Non-IT User')
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    experience_level = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Scenario(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ]
    
    SCENARIO_TYPE_CHOICES = [
        ('PHISHING', 'Phishing Attack'),
        ('DDOS', 'DDoS Attack'),
        ('RANSOMWARE', 'Ransomware Attack'),
        ('PASSWORD', 'Password Security'),
        ('SQL_INJECTION', 'SQL Injection'),
        ('XSS', 'Cross-Site Scripting')
    ]
    
    # Add role requirement to scenarios
    ROLE_REQUIREMENT = [
        ('IT', 'IT Only'),
        ('NON_IT', 'Non-IT Only'),
        ('ALL', 'All Users')
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    threat_type = models.CharField(max_length=50)  # e.g., 'phishing', 'ransomware', 'ddos'
    difficulty = models.CharField(
        max_length=20, 
        choices=DIFFICULTY_CHOICES,
        default='beginner'
    )
    time_limit = models.IntegerField(help_text='Time limit in seconds')
    created_at = models.DateTimeField(auto_now_add=True)
    scenario_type = models.CharField(max_length=50, choices=SCENARIO_TYPE_CHOICES, default='PASSWORD')
    environment_config = models.JSONField(default=dict)  # Store 3D environment settings
    learning_objectives = models.JSONField(default=list)
    recommended_time = models.IntegerField(help_text='Recommended time in minutes', default=60)
    required_role = models.CharField(max_length=10, choices=ROLE_REQUIREMENT, default='ALL')
    
    def __str__(self):
        return self.title

class Challenge(models.Model):
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    question = models.CharField(max_length=500)
    correct_answer = models.CharField(max_length=200)
    hints = models.JSONField(default=list)
    points = models.IntegerField(default=10)
    interaction_type = models.CharField(max_length=50, default='text')  # e.g., 'terminal', 'email', 'network'
    success_message = models.TextField(default='Correct! Well done.')
    failure_message = models.TextField(default='Incorrect. Try again.')
    learning_points = models.JSONField(default=list)
    
    def __str__(self):
        # This method defines the string representation of a Challenge object
        # It returns a formatted string that includes the title of the associated scenario
        # Used when printing or displaying the Challenge object
        # For example: "Challenge for Password Security Basics"
        return f"Challenge for {self.scenario.title}"

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    time_taken = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
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

class PhishingScenario(models.Model):
    SCENARIO_TYPES = [
        ('EMAIL', 'Email Phishing'),
        ('SOCIAL', 'Social Engineering'),
        ('SPEAR', 'Spear Phishing'),
        ('QUIZ', 'Security Quiz')
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    scenario_type = models.CharField(max_length=10, choices=SCENARIO_TYPES)
    difficulty = models.CharField(max_length=20, choices=Scenario.DIFFICULTY_CHOICES)
    content = models.JSONField(help_text='Scenario content (email template, quiz questions, etc)')
    correct_identifiers = models.JSONField(help_text='List of phishing indicators to identify')
    learning_points = models.JSONField(default=list)
    
    def __str__(self):
        return f"{self.get_scenario_type_display()}: {self.title}"

class PhishingAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    scenario = models.ForeignKey(PhishingScenario, on_delete=models.CASCADE)
    identified_correctly = models.BooleanField(default=False)
    user_selections = models.JSONField(default=list)
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'scenario']
