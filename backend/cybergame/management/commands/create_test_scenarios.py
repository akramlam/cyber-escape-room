from django.core.management.base import BaseCommand
from cybergame.models import Scenario, Challenge
from django.utils import timezone

class Command(BaseCommand):
    help = 'Creates test scenarios for development'

    def handle(self, *args, **kwargs):
        # Delete existing scenarios
        Scenario.objects.all().delete()

        # Create test scenarios
        scenarios = [
            {
                'title': 'Malware Analysis Challenge',
                'description': 'Analyze suspicious files and network traffic to identify malware behavior.',
                'threat_type': 'malware',
                'time_limit': 3600,  # 1 hour
                'challenges': [
                    {
                        'question': 'What is the name of the malicious process running in the background?',
                        'correct_answer': 'evil.exe',
                        'hints': ['Check the running processes list', 'Look for suspicious executable names'],
                        'points': 10
                    },
                    {
                        'question': 'What port is the malware using for command and control?',
                        'correct_answer': '4444',
                        'hints': ['Monitor network connections', 'Look for unusual port numbers'],
                        'points': 15
                    }
                ]
            },
            {
                'title': 'Network Intrusion Detection',
                'description': 'Investigate network logs to identify and respond to a potential breach.',
                'threat_type': 'network',
                'time_limit': 2700,  # 45 minutes
                'challenges': [
                    {
                        'question': 'What is the attacker\'s IP address?',
                        'correct_answer': '192.168.1.100',
                        'hints': ['Check the firewall logs', 'Look for repeated connection attempts'],
                        'points': 10
                    },
                    {
                        'question': 'What vulnerability did the attacker exploit? (CVE number)',
                        'correct_answer': 'cve-2021-44228',
                        'hints': ['Check application logs', 'Research Log4j vulnerabilities'],
                        'points': 20
                    }
                ]
            },
            {
                'title': 'Social Engineering Defense',
                'description': 'Learn to identify and prevent social engineering attacks.',
                'threat_type': 'phishing',
                'time_limit': 1800,  # 30 minutes
                'challenges': [
                    {
                        'question': 'What is the suspicious email domain used in the phishing attempt?',
                        'correct_answer': 'microsoft-support.xyz',
                        'hints': ['Check the email headers', 'Look for misspelled domain names'],
                        'points': 10
                    },
                    {
                        'question': 'What information is the phishing email trying to steal?',
                        'correct_answer': 'password',
                        'hints': ['Read the email content carefully', 'Look for urgent requests'],
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
                self.style.SUCCESS(f'Successfully created scenario: {scenario.title}')
            )
