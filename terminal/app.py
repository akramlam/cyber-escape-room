from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import re

app = Flask(__name__)
CORS(app)

ALLOWED_COMMANDS = {
    'ls': '/bin/ls',
    'pwd': '/bin/pwd',
    'whoami': '/usr/bin/whoami',
    'ping': '/bin/ping',
    'netstat': '/bin/netstat',
    'ps': '/bin/ps',
    'top': '/usr/bin/top',
    'nmap': '/usr/bin/nmap',
    'traceroute': '/usr/bin/traceroute'
}

def validate_command(command: str, expected: str) -> bool:
    """Validate if the command matches the expected answer"""
    # Clean and normalize both strings
    command = command.strip().lower()
    expected = expected.strip().lower()
    
    # Direct match
    if command == expected:
        return True
    
    # Command with arguments (e.g., "nmap localhost" matches "nmap")
    if expected in ALLOWED_COMMANDS and command.startswith(expected):
        return True
    
    return False

@app.route('/execute', methods=['POST'])
def execute_command():
    data = request.json
    command = data.get('command', '').strip()
    scenario_id = data.get('scenarioId')
    challenge_id = data.get('challengeId')
    expected_command = data.get('expected_command')
    
    if not command:
        return jsonify({'error': 'No command provided'}), 400
        
    cmd_parts = command.split()
    cmd = cmd_parts[0]
    
    if cmd not in ALLOWED_COMMANDS:
        return jsonify({'error': f'Command not allowed: {cmd}'}), 403
        
    try:
        result = subprocess.run(
            [ALLOWED_COMMANDS[cmd]] + cmd_parts[1:],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        response_data = {
            'output': result.stdout,
            'error': result.stderr,
            'command_correct': False
        }
        
        # Validate command if this is part of a challenge
        if expected_command:
            response_data['command_correct'] = validate_command(command, expected_command)
            if response_data['command_correct']:
                response_data['message'] = 'Correct command! Well done!'
            
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 