// Created automatically by Cursor AI (2024-12-19)

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString();
}

export function calculateSeverity(affectedUsers: number, dataTypes: string[]): 'low' | 'medium' | 'high' | 'critical' {
  if (affectedUsers > 100000 || dataTypes.includes('health') || dataTypes.includes('payment')) {
    return 'critical';
  }
  if (affectedUsers > 10000 || dataTypes.includes('password')) {
    return 'high';
  }
  if (affectedUsers > 1000) {
    return 'medium';
  }
  return 'low';
}

export function generateIncidentId(): string {
  return `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
}
