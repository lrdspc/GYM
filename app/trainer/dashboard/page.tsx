"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Calendar, TrendingUp, MessageCircle, Plus, User, Search } from "lucide-react"
import Link from "next/link"

import { DashboardLayout } from "@/components/optimized/DashboardLayout"
import { StatsCard, GRADIENT_CLASSES } from "@/components/optimized/StatsCard"
import { useOptimizedStudents, useOptimizedNotifications } from "@/lib/optimizations/DataManager"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TrainerDashboard() {
  const router = useRouter()
  const { students, loading } = useOptimizedStudents()
  const { notifications } = useOptimizedNotifications(1, "trainer")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
    <DashboardLayout
      title="Dashboard"
      subtitle="Bem-vindo, João!"
      userType="trainer"
      notificationCount={notifications.length}
      onLogout={() => router.push("/")}
    >
      <div className="mobile-stack">
        {/* Stats Cards */}
        <div className="mobile-grid gap-3">
          <StatsCard
            title="Alunos"
            value={students.length}
            subtitle="+2 novos"
            icon={Users}
            gradient={GRADIENT_CLASSES.blue}
          />
          <StatsCard
            title="Planos"
            value="7"
            subtitle="Ativos"
            icon={Calendar}
            gradient={GRADIENT_CLASSES.green}
          />
          <StatsCard
            title="Engajamento"
            value="85%"
            subtitle="+5% mês"
            icon={TrendingUp}
            gradient={GRADIENT_CLASSES.purple}
          />
          <StatsCard
            title="Mensagens"
            value="12"
            subtitle="3 não lidas"
            icon={MessageCircle}
            gradient={GRADIENT_CLASSES.orange}
          />
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
      </div>
    </DashboardLayout>
  )
}