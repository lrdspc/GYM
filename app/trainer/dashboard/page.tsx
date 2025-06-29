"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Bell, Plus, Users, Calendar, TrendingUp, LogOut, MessageCircle, User, Search, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MOCK_STUDENTS, getNotificationsByUser } from "@/lib/mock-data"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function TrainerDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState(MOCK_STUDENTS)
  const [notifications, setNotifications] = useState(getNotificationsByUser(1, "trainer"))

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">Carregando dashboard...</p>
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <p className="text-sm text-gray-500">Bem-vindo, João!</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative touch-target">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
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
          <Card className="mobile-card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Alunos</CardTitle>
              <Users className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs opacity-80">+2 novos</p>
            </CardContent>
          </Card>

          <Card className="mobile-card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Planos</CardTitle>
              <Calendar className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs opacity-80">Ativos</p>
            </CardContent>
          </Card>

          <Card className="mobile-card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Engajamento</CardTitle>
              <TrendingUp className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs opacity-80">+5% mês</p>
            </CardContent>
          </Card>

          <Card className="mobile-card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Mensagens</CardTitle>
              <MessageCircle className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs opacity-80">3 não lidas</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/trainer/create-plan">
                <Button className="w-full mobile-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 haptic-light">
                  <Plus className="h-5 w-5 mr-3" />
                  Criar Plano de Treino
                </Button>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/trainer/students">
                  <Button
                    variant="outline"
                    className="w-full mobile-button bg-transparent hover:bg-gray-50 haptic-light"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Alunos
                  </Button>
                </Link>

                <Link href="/trainer/messages">
                  <Button
                    variant="outline"
                    className="w-full mobile-button bg-transparent hover:bg-gray-50 haptic-light"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Mensagens
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="mobile-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Meus Alunos ({students.length})</CardTitle>
                <CardDescription>Gerencie e acompanhe o progresso</CardDescription>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mobile-input pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.slice(0, 5).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 border rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{student.name}</h3>
                      <Badge
                        variant={student.status === "Ativo" ? "default" : "secondary"}
                        className={`text-xs ${student.status === "Ativo" ? "bg-green-500" : ""}`}
                      >
                        {student.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{student.email}</p>
                    <p className="text-xs text-gray-400">{student.lastAccess}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.plansCount} planos</p>
                    <p className="text-xs text-gray-500">
                      {student.completedWorkouts}/{student.totalWorkouts}
                    </p>
                  </div>
                </div>
              ))}

              {filteredStudents.length > 5 && (
                <Link href="/trainer/students">
                  <Button variant="outline" className="w-full mobile-button bg-transparent">
                    Ver todos os alunos ({filteredStudents.length})
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === "workout"
                        ? "bg-green-500"
                        : notification.type === "message"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 mobile-button bg-transparent">
              Ver Todas as Notificações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-area-bottom">
        <div className="flex justify-around py-2">
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <Users className="h-5 w-5" />
            <span className="text-xs">Alunos</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col gap-1 h-16 touch-target">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Planos</span>
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
