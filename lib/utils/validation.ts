// Input validation utilities to prevent security issues
export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  password: {
    minLength: 6,
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
    message: 'Senha deve ter pelo menos 6 caracteres com letras e números'
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
    message: 'Nome deve conter apenas letras e espaços'
  },
  phone: {
    pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    message: 'Telefone deve estar no formato (11) 99999-9999'
  }
} as const;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: string, rules: keyof typeof ValidationRules): ValidationResult => {
  const rule = ValidationRules[rules];
  const errors: string[] = [];

  if (!value || value.trim() === '') {
    errors.push('Campo obrigatório');
    return { isValid: false, errors };
  }

  if ('minLength' in rule && value.length < rule.minLength) {
    errors.push(`Mínimo ${rule.minLength} caracteres`);
  }

  if ('maxLength' in rule && value.length > rule.maxLength) {
    errors.push(`Máximo ${rule.maxLength} caracteres`);
  }

  if ('pattern' in rule && !rule.pattern.test(value)) {
    errors.push(rule.message);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (data: Record<string, string>, schema: Record<string, keyof typeof ValidationRules>): ValidationResult => {
  const allErrors: string[] = [];

  for (const [field, rule] of Object.entries(schema)) {
    const result = validateField(data[field] || '', rule);
    if (!result.isValid) {
      allErrors.push(...result.errors.map(error => `${field}: ${error}`));
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .trim();
};

// Rate limiting for form submissions
class RateLimiter {
  private attempts = new Map<string, number[]>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier) || [];
    if (userAttempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...userAttempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeUntilReset);
  }
}

export const rateLimiter = new RateLimiter();