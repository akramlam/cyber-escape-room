from django.core.management.base import BaseCommand
from django.db import transaction
from cybergame.models import Scenario, Challenge

class Command(BaseCommand):
    help = 'Creates test scenarios for development'

    def handle(self, *args, **kwargs):
        with transaction.atomic():
            # Delete existing scenarios
            Scenario.objects.all().delete()
            
            # Reset the ID sequence
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM sqlite_sequence WHERE name='cybergame_scenario'")

            scenarios = [
                {
                    'id': 1,
                    'title': 'Network Reconnaissance',
                    'description': 'Learn basic network scanning and enumeration techniques.',
                    'threat_type': 'network_scanning',
                    'difficulty': 'beginner',
                    'time_limit': 1800,
                    'challenges': [
                        {
                            'question': 'What command would you use to scan open ports on a target?',
                            'correct_answer': 'nmap',
                            'hints': ['Think about network mapping tools', 'It starts with "n"'],
                            'points': 10
                        },
                        {
                            'question': 'What flag in nmap shows operating system detection?',
                            'correct_answer': '-O',
                            'hints': ['It\'s a capital letter', 'Stands for OS'],
                            'points': 15
                        }
                    ]
                },
                {
                    'id': 2,
                    'title': 'System Investigation',
                    'description': 'Learn to investigate system processes and network connections.',
                    'threat_type': 'system_analysis',
                    'difficulty': 'beginner',
                    'time_limit': 1800,
                    'challenges': [
                        {
                            'question': 'What command shows all running processes?',
                            'correct_answer': 'ps aux',
                            'hints': ['Process status command', 'Shows all user processes'],
                            'points': 10
                        },
                        {
                            'question': 'What command shows network connections?',
                            'correct_answer': 'netstat',
                            'hints': ['Network statistics command'],
                            'points': 15
                        }
                    ]
                },
                {
                    'id': 3,
                    'title': 'Network Troubleshooting',
                    'description': 'Learn to diagnose network connectivity issues.',
                    'threat_type': 'network_analysis',
                    'difficulty': 'beginner',
                    'time_limit': 1800,
                    'challenges': [
                        {
                            'question': 'What command would you use to test connectivity to 8.8.8.8?',
                            'correct_answer': 'ping 8.8.8.8',
                            'hints': ['Think about ICMP', 'Most basic network test'],
                            'points': 10
                        },
                        {
                            'question': 'What command traces the route to a destination?',
                            'correct_answer': 'traceroute',
                            'hints': ['Shows network path', 'Displays hops'],
                            'points': 15
                        }
                    ]
                }
            ]

            for scenario_data in scenarios:
                challenges = scenario_data.pop('challenges')
                scenario = Scenario.objects.create(**scenario_data)
                
                for challenge_data in challenges:
                    Challenge.objects.create(scenario=scenario, **challenge_data)
                
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created scenario: {scenario.title} with ID: {scenario.id}')
                )
