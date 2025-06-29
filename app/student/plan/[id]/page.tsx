"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Clock, Target, Weight, RotateCcw, CheckCircle, Play, Pause } from "lucide-react"
import Link from "next/link"
import { MOCK_TRAINING_PLANS, type TrainingPlan } from "@/lib/mock-data"
import { LoadingPage } from "@/components/ui/loading-spinner"
import { useParams } from "next/navigation"

export default function PlanDetails() {
  const params = useParams()
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const [plan, setPlan] = useState<TrainingPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [workoutTime, setWorkoutTime] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      const foundPlan = MOCK_TRAINING_PLANS.find((p) => p.id === Number.parseInt(params.id as string))
      setPlan(foundPlan || null)
      setLoading(false)
    }, 500)
  }, [params.id])

  useEffect(() => {
    if (plan) {
      const saved = localStorage.getItem(`completed-exercises-${plan.id}`)
      if (saved) {
        setCompletedExercises(JSON.parse(saved))
      }
    }
  }, [plan])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (workoutStarted) {
      interval = setInterval(() => {
        setWorkoutTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [workoutStarted])

  const toggleExercise = (exerciseId: string) => {
    const newCompleted = completedExercises.includes(exerciseId)
      ? completedExercises.filter((id) => id !== exerciseId)
      : [...completedExercises, exerciseId]

    setCompletedExercises(newCompleted)
    if (plan) {
      localStorage.setItem(`completed-exercises-${plan.id}`, JSON.stringify(newCompleted))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startWorkout = () => {
    setWorkoutStarted(true)
    setWorkoutTime(0)
  }

  const pauseWorkout = () => {
    setWorkoutStarted(false)
  }

  if (loading) {
    return <LoadingPage />
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="mobile-card text-center p-8">
          <CardContent>
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Plano não encontrado</h3>
            <p className="text-gray-400 mb-4">O plano que você está procurando não existe.</p>
            <Link href="/student/dashboard">
              <Button className="mobile-button">Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completionPercentage = (completedExercises.length / plan.exercises.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 safe-area-bottom">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/student/dashboard">
              <Button variant="ghost" size="sm" className="touch-target">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="text-center flex-1 mx-4">
              <h1 className="text-lg font-semibold truncate">{plan.name}</h1>
              <p className="text-sm text-gray-500">Por {plan.trainer}</p>
            </div>
            <div className="w-16"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      <div className="px-4 py-6 mobile-stack">
        {/* Workout Timer */}
        {workoutStarted && (
          <Card className="mobile-card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Tempo de Treino</p>
                  <p className="text-2xl font-bold">{formatTime(workoutTime)}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={pauseWorkout}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
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

              {/* Start Workout Button */}
              {!workoutStarted && (
                <Button
                  onClick={startWorkout}
                  className="w-full mobile-button bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 haptic-light"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Iniciar Treino
                </Button>
              )}
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
                <div
                  key={exercise.id}
                  className={`border rounded-xl p-4 transition-all ${
                    completedExercises.includes(exercise.id) ? "bg-green-50 border-green-200" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={completedExercises.includes(exercise.id)}
                      onCheckedChange={() => toggleExercise(exercise.id)}
                      className="mt-1 touch-target"
                    />

                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3
                          className={`font-semibold text-lg leading-tight ${
                            completedExercises.includes(exercise.id) ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {index + 1}. {exercise.name}
                        </h3>
                        {completedExercises.includes(exercise.id) && (
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
              ))}
            </div>

            {/* Workout Complete */}
            {completedExercises.length === plan.exercises.length && (
              <div className="mt-6">
                <Card className="mobile-card bg-green-50 border-green-200">
                  <CardContent className="text-center py-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Parabéns! Treino Concluído!</h3>
                    <p className="text-green-600 mb-4">Você completou todos os exercícios do treino de hoje.</p>
                    <p className="text-sm text-green-600 mb-4">Tempo total: {formatTime(workoutTime)}</p>
                    <Button className="mobile-button bg-green-600 hover:bg-green-700 haptic-light">
                      Finalizar Treino
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
