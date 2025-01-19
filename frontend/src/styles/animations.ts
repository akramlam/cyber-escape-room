import { keyframes } from '@emotion/react';

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const slideIn = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const glitch = keyframes`
  0% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(-5px, 5px);
  }
  20% {
    clip-path: inset(15% 0 65% 0);
    transform: translate(5px, -5px);
  }
  40% {
    clip-path: inset(80% 0 5% 0);
    transform: translate(-5px, 5px);
  }
  60% {
    clip-path: inset(40% 0 43% 0);
    transform: translate(5px, -5px);
  }
  80% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(-5px, 5px);
  }
  100% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(0);
  }
`;

export const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 255, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
  }
`;

export const matrix = keyframes`
  0% {
    text-shadow: 0 0 0 #0f0;
  }
  50% {
    text-shadow: 0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0;
  }
  100% {
    text-shadow: 0 0 0 #0f0;
  }
`;
