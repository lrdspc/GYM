'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'

// Debounced state hook
export const useDebouncedState = <T>(initialValue: T, delay: number = 300) => {
  const [value, setValue] = useState<T>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])

  return [debouncedValue, setValue] as const
}

// Optimized list state with memoization
export const useOptimizedList = <T extends { id: string | number }>(initialItems: T[] = []) => {
  const [items, setItems] = useState<T[]>(initialItems)

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item])
  }, [])

  const removeItem = useCallback((id: string | number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const updateItem = useCallback((id: string | number, updates: Partial<T>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const findItem = useCallback((id: string | number) => {
    return items.find(item => item.id === id)
  }, [items])

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (typeof a.id === 'string' && typeof b.id === 'string') {
        return a.id.localeCompare(b.id)
      }
      return Number(a.id) - Number(b.id)
    })
  }, [items])

  return {
    items,
    sortedItems,
    addItem,
    removeItem,
    updateItem,
    findItem,
    setItems
  }
}

// Local storage state with sync
export const useLocalStorageState = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value
      setState(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, state])

  return [state, setValue] as const
}

// Async state management
export const useAsyncState = <T>(asyncFunction: () => Promise<T>, deps: any[] = []) => {
  const [state, setState] = useState<{
    data: T | null
    loading: boolean
    error: Error | null
  }>({
    data: null,
    loading: true,
    error: null
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await asyncFunction()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error })
    }
  }, deps)

  useEffect(() => {
    execute()
  }, [execute])

  const retry = useCallback(() => {
    execute()
  }, [execute])

  return { ...state, retry }
}

// Form state with validation
export const useFormState = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Record<string, string>
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const validate = useCallback(() => {
    if (!validationSchema) return true

    const newErrors = validationSchema(values)
    setErrors(newErrors)
    
    return Object.keys(newErrors).length === 0
  }, [values, validationSchema])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0
  }, [errors])

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues)
  }, [values, initialValues])

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validate,
    reset,
    isValid,
    isDirty
  }
}

// Pagination state
export const usePagination = (totalItems: number, itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage)
  }, [totalItems, itemsPerPage])

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage
  }, [currentPage, itemsPerPage])

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems)
  }, [startIndex, itemsPerPage, totalItems])

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  const canGoNext = currentPage < totalPages
  const canGoPrev = currentPage > 1

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev
  }
}