"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Clock, Target, Weight, RotateCcw, CheckCircle, Play, Pause } from "lucide-react"
import Link from "next/link"
import { MOCK_TRAINING_PLANS, type TrainingPlan } from "@/lib/mock-data"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useParams, useRouter } from "next/navigation"
import { OptimizedErrorBoundary } from "@/components/optimized/ErrorBoundary"

// Hook otimizado para gerenciar estado do treino
const useWorkoutState = (planId: string) => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Carregar exercícios salvos do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`completed-exercises-${planId}`);
      if (saved) {
        setCompletedExercises(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar exercícios salvos:', error);
    }
  }, [planId]);

  // Timer do treino otimizado
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (workoutStarted && !isPaused) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workoutStarted, isPaused]);

  // Salvar progresso no localStorage
  const saveProgress = useCallback((exercises: string[]) => {
    try {
      localStorage.setItem(`completed-exercises-${planId}`, JSON.stringify(exercises));
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }, [planId]);

  const toggleExercise = useCallback((exerciseId: string) => {
    setCompletedExercises(prev => {
      const newCompleted = prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId];
      
      saveProgress(newCompleted);
      return newCompleted;
    });
  }, [saveProgress]);

  const startWorkout = useCallback(() => {
    setWorkoutStarted(true);
    setIsPaused(false);
    setWorkoutTime(0);
  }, []);

  const pauseWorkout = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const resetWorkout = useCallback(() => {
    setWorkoutStarted(false);
    setIsPaused(false);
    setWorkoutTime(0);
    setCompletedExercises([]);
    try {
      localStorage.removeItem(`completed-exercises-${planId}`);
    } catch (error) {
      console.error('Erro ao limpar progresso:', error);
    }
  }, [planId]);

  return {
    completedExercises,
    workoutStarted,
    workoutTime,
    isPaused,
    toggleExercise,
    startWorkout,
    pauseWorkout,
    resetWorkout
  };
};

// Hook para buscar plano com cache e tratamento de erro
const usePlan = (id: string) => {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simular delay de API com cache
        const cacheKey = `plan-${id}`;
        const cached = sessionStorage.getItem(cacheKey);
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          // Cache válido por 5 minutos
          if (Date.now() - timestamp < 300000) {
            setPlan(data);
            setLoading(false);
            return;
          }
        }

        // Simular busca na API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundPlan = MOCK_TRAINING_PLANS.find(p => p.id === parseInt(id));
        
        if (!foundPlan) {
          setError('Plano não encontrado');
          return;
        }

        // Salvar no cache
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: foundPlan,
          timestamp: Date.now()
        }));

        setPlan(foundPlan);
      } catch (err) {
        setError('Erro ao carregar plano');
        console.error('Erro ao buscar plano:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlan();
    }
  }, [id]);

  return { plan, loading, error };
};

// Componente otimizado para o timer
const WorkoutTimer = ({ workoutTime, isPaused, onPause }: {
  workoutTime: number;
  isPaused: boolean;
  onPause: () => void;
}) => {
  const formatTime = useMemo(() => {
    const mins = Math.floor(workoutTime / 60);
    const secs = workoutTime % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [workoutTime]);

  return (
    <Card className="mobile-card bg-gradient-to-r from-green-500 to-green-600 text-white">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Tempo de Treino</p>
            <p className="text-2xl font-bold">{formatTime}</p>
            {isPaused && <p className="text-xs opacity-75">PAUSADO</p>}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onPause}
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente otimizado para exercício
const ExerciseCard = ({ 
  exercise, 
  index, 
  isCompleted, 
  onToggle 
}: {
  exercise: any;
  index: number;
  isCompleted: boolean;
  onToggle: () => void;
}) => (
  <div
    className={`border rounded-xl p-4 transition-all ${
      isCompleted ? "bg-green-50 border-green-200" : "bg-white"
    }`}
  >
    <div className="flex items-start gap-3">
      <Checkbox
        checked={isCompleted}
        onCheckedChange={onToggle}
        className="mt-1 touch-target"
      />

      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-start">
          <h3
            className={`font-semibold text-lg leading-tight ${
              isCompleted ? "line-through text-gray-500" : ""
            }`}
          >
            {index + 1}. {exercise.name}
          </h3>
          {isCompleted && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
              ✓
            </Badge>
          )}
        </div>

        {/* Exercise Details Grid */}
        <div className="mobile-grid gap-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Séries</p>
              <p className="font-medium">{exercise.sets}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Repetições</p>
              <p className="font-medium">{exercise.reps}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Peso</p>
              <p className="font-medium">{exercise.weight}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Descanso</p>
              <p className="font-medium">{exercise.rest}</p>
            </div>
          </div>
        </div>

        {/* Exercise Notes */}
        {exercise.notes && (
          <div className="bg-blue-50 p-3 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Observações:</strong> {exercise.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

function PlanDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;
  
  const { plan, loading, error } = usePlan(planId);
  const {
    completedExercises,
    workoutStarted,
    workoutTime,
    isPaused,
    toggleExercise,
    startWorkout,
    pauseWorkout,
    resetWorkout
  } = useWorkoutState(planId);

  const completionPercentage = useMemo(() => {
    if (!plan?.exercises.length) return 0;
    return (completedExercises.length / plan.exercises.length) * 100;
  }, [completedExercises.length, plan?.exercises.length]);

  const isWorkoutComplete = useMemo(() => 
    plan?.exercises.length > 0 && completedExercises.length === plan.exercises.length,
    [plan?.exercises.length, completedExercises.length]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">Carregando plano...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="mobile-card text-center p-8">
          <CardContent>
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              {error || 'Plano não encontrado'}
            </h3>
            <p className="text-gray-400 mb-4">
              {error ? 'Tente novamente mais tarde.' : 'O plano que você está procurando não existe.'}
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.back()} 
                variant="outline"
                className="mobile-button"
              >
                Voltar
              </Button>
              <Button 
                onClick={() => router.push('/student/dashboard')}
                className="mobile-button"
              >
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-bottom">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="touch-target"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="text-center flex-1 mx-4">
              <h1 className="text-lg font-semibold truncate">{plan.name}</h1>
              <p className="text-sm text-gray-500">Por {plan.trainer}</p>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 mobile-stack">
        {/* Workout Timer */}
        {workoutStarted && (
          <WorkoutTimer
            workoutTime={workoutTime}
            isPaused={isPaused}
            onPause={pauseWorkout}
          />
        )}

        {/* Plan Overview */}
        <Card className="mobile-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl leading-tight">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </div>
              <Badge variant="secondary" className="ml-2">
                {plan.duration}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mobile-stack">
              {/* Progress Indicators */}
              <div className="mobile-grid gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Progresso Geral</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                  <p className="text-xs text-gray-500">{plan.progress}% concluído</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Treino de Hoje</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {completedExercises.length} de {plan.exercises.length} exercícios
                  </p>
                </div>
              </div>

              {/* Workout Controls */}
              <div className="flex gap-2">
                {!workoutStarted ? (
                  <Button
                    onClick={startWorkout}
                    className="flex-1 mobile-button bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 haptic-light"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Iniciar Treino
                  </Button>
                ) : (
                  <Button
                    onClick={resetWorkout}
                    variant="outline"
                    className="flex-1 mobile-button"
                  >
                    Reiniciar Treino
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercises */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle>Exercícios do Treino</CardTitle>
            <CardDescription>Marque conforme você completa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  isCompleted={completedExercises.includes(exercise.id)}
                  onToggle={() => toggleExercise(exercise.id)}
                />
              ))}
            </div>

            {/* Workout Complete */}
            {isWorkoutComplete && (
              <div className="mt-6">
                <Card className="mobile-card bg-green-50 border-green-200">
                  <CardContent className="text-center py-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      Parabéns! Treino Concluído!
                    </h3>
                    <p className="text-green-600 mb-4">
                      Você completou todos os exercícios do treino de hoje.
                    </p>
                    {workoutStarted && (
                      <p className="text-sm text-green-600 mb-4">
                        Tempo total: {Math.floor(workoutTime / 60)}:{(workoutTime % 60).toString().padStart(2, '0')}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 mobile-button bg-green-600 hover:bg-green-700 haptic-light"
                        onClick={() => router.push('/student/dashboard')}
                      >
                        Finalizar Treino
                      </Button>
                      <Button 
                        variant="outline"
                        className="mobile-button"
                        onClick={resetWorkout}
                      >
                        Novo Treino
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PlanDetails() {
  return (
    <OptimizedErrorBoundary>
      <PlanDetailsContent />
    </OptimizedErrorBoundary>
  );
}