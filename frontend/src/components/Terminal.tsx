import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';

const TerminalWrapper = styled('div')(({ theme }) => ({
  backgroundColor: '#000',
  color: '#00ff00',
  fontFamily: 'Courier New, monospace',
  padding: theme.spacing(2),
  height: '500px',
  overflowY: 'auto',
  border: '1px solid #00ff00',
  borderRadius: '4px',
  position: 'relative',
}));

const TerminalPrompt = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '"$ "',
    color: '#00ff00',
    marginRight: '8px',
  },
});

const TerminalInput = styled('input')({
  background: 'transparent',
  border: 'none',
  color: '#00ff00',
  fontFamily: 'Courier New, monospace',
  fontSize: '16px',
  width: '100%',
  outline: 'none',
  caretColor: '#00ff00',
});

interface TerminalProps {
  scenarioId?: string;
  challenge?: Challenge;
  onSuccess?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ scenarioId, challenge, onSuccess }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCommand = async (command: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          command,
          scenarioId,
          challengeId: challenge?.id,
          expected_command: challenge?.correct_answer
        }),
      });

      const data = await response.json();
      
      setHistory(prev => [...prev, 
        `$ ${command}`,
        data.output || data.error || 'No output'
      ]);

      if (data.command_correct && onSuccess) {
        setHistory(prev => [...prev, '✅ Command correct! Moving to next challenge...']);
        onSuccess();
      }

      // Update command history
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    } catch (error) {
      setHistory(prev => [...prev, 
        `$ ${command}`,
        'Error executing command'
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      handleCommand(currentInput.trim());
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [history]);

  return (
    <TerminalWrapper ref={containerRef} onClick={() => inputRef.current?.focus()}>
      {history.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <TerminalPrompt>
        <TerminalInput
          ref={inputRef}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </TerminalPrompt>
    </TerminalWrapper>
  );
};

export default Terminal; 