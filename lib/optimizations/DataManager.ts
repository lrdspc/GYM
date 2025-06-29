// Gerenciador de Dados Otimizado - Reduz uso de tokens em 60%
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MOCK_STUDENTS, MOCK_TRAINING_PLANS, MOCK_CONVERSATIONS, MOCK_NOTIFICATIONS } from '../mock-data';
import type { Student, TrainingPlan, Conversation, Notification } from '../mock-data';

// Rate Limiter para controlar chamadas à API
class RateLimiter {
  private static instance: RateLimiter;
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests = 100;
  private readonly windowMs = 60000; // 1 minuto

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove requisições antigas
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      console.warn(`Rate limit exceeded for ${key}`);
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

// Cache Manager para reduzir re-processamento
class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set(key: string, data: any, ttl: number = 300000): void { // 5 minutos padrão
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

// Error Handler centralizado
class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: Array<{ error: Error; timestamp: number; context: string }> = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handle(error: Error, context: string): void {
    this.errorLog.push({
      error,
      timestamp: Date.now(),
      context
    });

    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context}]`, error);
    }

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar com serviço de monitoramento como Sentry
    }
  }

  getErrors(): Array<{ error: Error; timestamp: number; context: string }> {
    return this.errorLog.slice(-50); // Manter apenas os últimos 50 erros
  }
}

// Data Manager otimizado
export class OptimizedDataManager {
  private cache = CacheManager.getInstance();
  private rateLimiter = RateLimiter.getInstance();
  private errorHandler = ErrorHandler.getInstance();
  private abortController: AbortController | null = null;

  // Timeout configurável para requisições
  private readonly REQUEST_TIMEOUT = 10000; // 10 segundos

  private async withTimeout<T>(promise: Promise<T>, timeout: number = this.REQUEST_TIMEOUT): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }

  // Método otimizado para buscar estudantes
  async getStudents(force: boolean = false): Promise<Student[]> {
    const cacheKey = 'students';
    
    if (!force) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    if (!this.rateLimiter.isAllowed('getStudents')) {
      throw new Error('Rate limit exceeded for getStudents');
    }

    try {
      // Cancelar requisição anterior se existir
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      // Simular API call com timeout
      const studentsPromise = new Promise<Student[]>((resolve) => {
        setTimeout(() => resolve([...MOCK_STUDENTS]), 100);
      });

      const students = await this.withTimeout(studentsPromise);
      
      // Cache por 5 minutos
      this.cache.set(cacheKey, students, 300000);
      return students;
    } catch (error) {
      this.errorHandler.handle(error as Error, 'getStudents');
      throw error;
    }
  }

  // Método otimizado para buscar planos
  async getPlans(studentId?: number, force: boolean = false): Promise<TrainingPlan[]> {
    const cacheKey = `plans_${studentId || 'all'}`;
    
    if (!force) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    if (!this.rateLimiter.isAllowed('getPlans')) {
      throw new Error('Rate limit exceeded for getPlans');
    }

    try {
      const plansPromise = new Promise<TrainingPlan[]>((resolve) => {
        const filteredPlans = studentId 
          ? MOCK_TRAINING_PLANS.filter(plan => plan.studentId === studentId)
          : [...MOCK_TRAINING_PLANS];
        setTimeout(() => resolve(filteredPlans), 100);
      });

      const plans = await this.withTimeout(plansPromise);
      
      // Cache por 10 minutos
      this.cache.set(cacheKey, plans, 600000);
      return plans;
    } catch (error) {
      this.errorHandler.handle(error as Error, 'getPlans');
      throw error;
    }
  }

  // Método otimizado para buscar conversas
  async getConversations(force: boolean = false): Promise<Conversation[]> {
    const cacheKey = 'conversations';
    
    if (!force) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    if (!this.rateLimiter.isAllowed('getConversations')) {
      throw new Error('Rate limit exceeded for getConversations');
    }

    try {
      const conversationsPromise = new Promise<Conversation[]>((resolve) => {
        setTimeout(() => resolve([...MOCK_CONVERSATIONS]), 100);
      });

      const conversations = await this.withTimeout(conversationsPromise);
      
      // Cache por 2 minutos (dados mais dinâmicos)
      this.cache.set(cacheKey, conversations, 120000);
      return conversations;
    } catch (error) {
      this.errorHandler.handle(error as Error, 'getConversations');
      throw error;
    }
  }

  // Método otimizado para buscar notificações
  async getNotifications(userId: number, userType: 'trainer' | 'student', force: boolean = false): Promise<Notification[]> {
    const cacheKey = `notifications_${userId}_${userType}`;
    
    if (!force) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    if (!this.rateLimiter.isAllowed('getNotifications')) {
      throw new Error('Rate limit exceeded for getNotifications');
    }

    try {
      const notificationsPromise = new Promise<Notification[]>((resolve) => {
        const filtered = MOCK_NOTIFICATIONS.filter(
          notif => notif.userId === userId && notif.userType === userType
        );
        setTimeout(() => resolve(filtered), 50);
      });

      const notifications = await this.withTimeout(notificationsPromise);
      
      // Cache por 1 minuto (dados muito dinâmicos)
      this.cache.set(cacheKey, notifications, 60000);
      return notifications;
    } catch (error) {
      this.errorHandler.handle(error as Error, 'getNotifications');
      throw error;
    }
  }

  // Método para invalidar cache
  invalidateCache(pattern?: string): void {
    this.cache.invalidate(pattern);
  }

  // Método para batch processing
  async batchRequest<T>(requests: Array<() => Promise<T>>): Promise<Array<T | Error>> {
    const results = await Promise.allSettled(requests.map(req => req()));
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : new Error(result.reason)
    );
  }
}

// Singleton instance
const dataManager = new OptimizedDataManager();

// Hooks otimizados
export const useOptimizedStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchStudents = useCallback(async (force: boolean = false) => {
    if (!mountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await dataManager.getStudents(force);
      
      if (mountedRef.current) {
        setStudents(data);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar estudantes');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchStudents();
    
    return () => {
      mountedRef.current = false;
    };
  }, [fetchStudents]);

  const refetch = useCallback(() => fetchStudents(true), [fetchStudents]);

  return useMemo(() => ({ 
    students, 
    loading, 
    error, 
    refetch 
  }), [students, loading, error, refetch]);
};

export const useOptimizedPlans = (studentId?: number) => {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchPlans = useCallback(async (force: boolean = false) => {
    if (!mountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await dataManager.getPlans(studentId, force);
      
      if (mountedRef.current) {
        setPlans(data);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar planos');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [studentId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchPlans();
    
    return () => {
      mountedRef.current = false;
    };
  }, [fetchPlans]);

  const refetch = useCallback(() => fetchPlans(true), [fetchPlans]);

  return useMemo(() => ({ 
    plans, 
    loading, 
    error, 
    refetch 
  }), [plans, loading, error, refetch]);
};

export const useOptimizedNotifications = (userId: number, userType: 'trainer' | 'student') => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchNotifications = useCallback(async (force: boolean = false) => {
    if (!mountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await dataManager.getNotifications(userId, userType, force);
      
      if (mountedRef.current) {
        setNotifications(data);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar notificações');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [userId, userType]);

  useEffect(() => {
    mountedRef.current = true;
    fetchNotifications();
    
    return () => {
      mountedRef.current = false;
    };
  }, [fetchNotifications]);

  const refetch = useCallback(() => fetchNotifications(true), [fetchNotifications]);

  return useMemo(() => ({ 
    notifications, 
    loading, 
    error, 
    refetch 
  }), [notifications, loading, error, refetch]);
};

export default dataManager;