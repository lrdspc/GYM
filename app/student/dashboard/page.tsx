"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  LogOut,
  Play,
  MessageCircle,
  Bell,
  Flame,
  Trophy,
  Timer,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MOCK_TRAINING_PLANS, getNotificationsByUser } from "@/lib/mock-data"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function StudentDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentPlans, setCurrentPlans] = useState(MOCK_TRAINING_PLANS.filter((plan) => plan.studentId === 1))
  const [notifications, setNotifications] = useState(getNotificationsByUser(1, "student"))

  const recentWorkouts = [
    { date: "Hoje", plan: "Treino de Força", duration: "45 min", completed: true, exercises: 6 },
    { date: "Ontem", plan: "Cardio e Resistência", duration: "30 min", completed: true, exercises: 4 },
    { date: "2 dias atrás", plan: "Treino de Força", duration: "50 min", completed: true, exercises: 7 },
    { date: "3 dias atrás", plan: "Cardio e Resistência", duration: "35 min", completed: true, exercises: 5 },
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">Carregando seu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-bottom">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                  AS
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">Olá, Ana!</h1>
                <p className="text-sm text-gray-500">Pronta para treinar? 💪</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative touch-target">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>

              {/* Menu */}
              <Button variant="ghost" size="sm" className="touch-target">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 mobile-stack">
        {/* Stats Cards */}
        <div className="mobile-grid gap-3">
          <Card className="mobile-card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Treinos</CardTitle>
              <Target className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">19</div>
              <p className="text-xs opacity-80">Este mês</p>
            </CardContent>
          </Card>

          <Card className="mobile-card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tempo</CardTitle>
              <Clock className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14h</div>
              <p className="text-xs opacity-80">Este mês</p>
            </CardContent>
          </Card>

          <Card className="mobile-card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Sequência</CardTitle>
              <Flame className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs opacity-80">dias consecutivos</p>
            </CardContent>
          </Card>

          <Card className="mobile-card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Planos</CardTitle>
              <Calendar className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentPlans.length}</div>
              <p className="text-xs opacity-80">Ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Training Plans */}
        <div className="mobile-stack">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Meus Planos</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {currentPlans.length} ativos
            </Badge>
          </div>

          {currentPlans.map((plan) => (
            <Card key={plan.id} className="mobile-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{plan.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <span>Por {plan.trainer}</span>
                      <Badge variant="outline" className="text-xs">
                        {plan.difficulty}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {plan.duration}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="mobile-stack">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso Geral</span>
                    <span className="font-medium">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-3" />
                </div>

                {/* Stats Grid */}
                <div className="mobile-grid gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-gray-600">Exercícios</span>
                    </div>
                    <p className="font-semibold">{plan.exercises.length} exercícios</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600">Treinos</span>
                    </div>
                    <p className="font-semibold">15/20</p>
                  </div>
                </div>

                {/* Next Workout */}
                <div className="bg-blue-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Timer className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Próximo Treino</span>
                  </div>
                  <p className="text-sm text-blue-700">{plan.nextWorkout}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link href={`/student/plan/${plan.id}`} className="flex-1">
                    <Button className="w-full mobile-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 haptic-light">
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar Treino
                    </Button>
                  </Link>
                  <Button variant="outline" className="mobile-button haptic-light bg-transparent">
                    Histórico
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Seus últimos treinos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentWorkouts.map((workout, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{workout.plan}</p>
                    <p className="text-xs text-gray-500">{workout.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium">{workout.duration}</p>
                    <p className="text-xs text-gray-500">{workout.exercises} exercícios</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/student/progress">
              <Button
                variant="outline"
                className="w-full justify-start mobile-button bg-transparent hover:bg-gray-50 haptic-light"
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                Ver Meu Progresso
              </Button>
            </Link>
            <Link href="/student/messages">
              <Button
                variant="outline"
                className="w-full justify-start mobile-button bg-transparent hover:bg-gray-50 haptic-light"
              >
                <MessageCircle className="h-4 w-4 mr-3" />
                Conversar com Personal
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start mobile-button bg-transparent hover:bg-gray-50 haptic-light"
            >
              <Calendar className="h-4 w-4 mr-3" />
              Histórico de Treinos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-area-bottom">
        <div className="flex justify-around py-2">
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Treinos</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Progresso</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">Mensagens</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="text-xs">Sair</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
