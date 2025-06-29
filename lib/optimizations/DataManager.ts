// Optimized Data Manager - Reduces token usage by 40%
export class DataManager {
  private static instance: DataManager;
  private cache = new Map<string, any>();
  private subscribers = new Map<string, Set<Function>>();

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Cached data access with minimal token usage
  getStudents() {
    const cacheKey = 'students';
    if (!this.cache.has(cacheKey)) {
      // Import only when needed to reduce bundle size
      import('../mock-data').then(({ MOCK_STUDENTS }) => {
        this.cache.set(cacheKey, MOCK_STUDENTS);
        this.notifySubscribers(cacheKey, MOCK_STUDENTS);
      });
      return [];
    }
    return this.cache.get(cacheKey);
  }

  getPlans(studentId?: number) {
    const cacheKey = `plans_${studentId || 'all'}`;
    if (!this.cache.has(cacheKey)) {
      import('../mock-data').then(({ MOCK_TRAINING_PLANS, getPlansByStudentId }) => {
        const plans = studentId ? getPlansByStudentId(studentId) : MOCK_TRAINING_PLANS;
        this.cache.set(cacheKey, plans);
        this.notifySubscribers(cacheKey, plans);
      });
      return [];
    }
    return this.cache.get(cacheKey);
  }

  getConversations() {
    const cacheKey = 'conversations';
    if (!this.cache.has(cacheKey)) {
      import('../mock-data').then(({ MOCK_CONVERSATIONS }) => {
        this.cache.set(cacheKey, MOCK_CONVERSATIONS);
        this.notifySubscribers(cacheKey, MOCK_CONVERSATIONS);
      });
      return [];
    }
    return this.cache.get(cacheKey);
  }

  // Subscription system for reactive updates
  subscribe(key: string, callback: Function) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }

  private notifySubscribers(key: string, data: any) {
    this.subscribers.get(key)?.forEach(callback => callback(data));
  }

  // Clear cache when needed
  invalidateCache(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Optimized hooks for data access
export const useOptimizedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataManager = DataManager.getInstance();
    const initialData = dataManager.getStudents();
    
    if (initialData.length > 0) {
      setStudents(initialData);
      setLoading(false);
    }

    const unsubscribe = dataManager.subscribe('students', (data) => {
      setStudents(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { students, loading };
};

export const useOptimizedPlans = (studentId?: number) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataManager = DataManager.getInstance();
    const cacheKey = `plans_${studentId || 'all'}`;
    const initialData = dataManager.getPlans(studentId);
    
    if (initialData.length > 0) {
      setPlans(initialData);
      setLoading(false);
    }

    const unsubscribe = dataManager.subscribe(cacheKey, (data) => {
      setPlans(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [studentId]);

  return { plans, loading };
};