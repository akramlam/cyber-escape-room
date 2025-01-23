def create_it_scenarios():
    return [
        {
            'title': 'Server Under Attack',
            'description': 'A production server is experiencing a DDoS attack. Investigate and mitigate.',
            'required_role': 'IT',
            'challenges': [
                {
                    'question': 'Check current network connections',
                    'correct_answer': 'netstat -an',
                    'hints': ['Use netstat to view network statistics']
                },
                # More technical challenges...
            ]
        }
    ]

def create_non_it_scenarios():
    return [
        {
            'title': 'Email Security Basics',
            'description': 'Learn to identify phishing emails and protect sensitive information',
            'required_role': 'NON_IT',
            'challenges': [
                {
                    'question': 'Which of these is a sign of a phishing email?',
                    'type': 'multiple_choice',
                    'options': [
                        'Urgent request for personal information',
                        'Company logo in the email',
                        'Colleague\'s name in the sender field',
                        'Meeting invitation'
                    ],
                    'correct_answer': 0
                }
            ]
        }
    ] 