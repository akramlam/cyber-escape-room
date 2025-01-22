#!/usr/bin/env python3
import os
import sys
import subprocess

ALLOWED_COMMANDS = {
    'ls': '/bin/ls',
    'pwd': '/bin/pwd',
    'whoami': '/usr/bin/whoami',
    'ping': '/bin/ping',
    'netstat': '/bin/netstat',
    'ps': '/bin/ps',
    'top': '/usr/bin/top',
}

def main():
    while True:
        try:
            sys.stdout.write('$ ')
            sys.stdout.flush()
            command = input().strip()
            
            if command == 'exit':
                sys.exit(0)
                
            cmd_parts = command.split()
            if not cmd_parts:
                continue
                
            cmd = cmd_parts[0]
            
            if cmd not in ALLOWED_COMMANDS:
                print(f"Command not allowed: {cmd}")
                continue
                
            full_command = [ALLOWED_COMMANDS[cmd]] + cmd_parts[1:]
            subprocess.run(full_command)
            
        except (EOFError, KeyboardInterrupt):
            sys.exit(0)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == '__main__':
    main() 