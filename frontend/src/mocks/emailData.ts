import { Email } from '../types/scene';

export const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Urgent: Your Account Security',
    sender: 'security@bankservice.com',
    content: 'Your account has been compromised. Click here to verify your identity.',
    isPhishing: true,
    indicators: ['urgency', 'suspicious-link', 'generic-greeting']
  },
  {
    id: '2',
    subject: 'Package Delivery Notice',
    sender: 'delivery@shipping.com',
    content: 'Your package is waiting. Download attachment to see details.',
    isPhishing: true,
    indicators: ['attachment', 'vague-sender']
  },
  {
    id: '3',
    subject: 'Team Meeting Notes',
    sender: 'john@company.com',
    content: 'Here are the notes from today\'s meeting.',
    isPhishing: false,
    indicators: []
  }
]; 