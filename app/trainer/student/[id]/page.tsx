"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingPage } from "@/components/ui/loading-spinner"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Target,
  TrendingUp,
  MessageCircle,
  Plus,
  Edit,
  Activity,
  Clock,
  Trophy,
} from "lucide-react"
import Link from "next/link"
import { getStudentById, getPlansByStudentId, type Student, type TrainingPlan } from "@/lib/mock-data"

interface StudentDetailsProps {
  params: {
    id: string
  }
}

export default function StudentDetails({ params }: StudentDetailsProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [plans, setPlans] = useState<TrainingPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular loading
    setTimeout(() => {
      const studentData = getStudentById(Number.parseInt(params.id))
      const studentPlans = getPlansByStudentId(Number.parseInt(params.id))

      setStudent(studentData || null)
      setPlans(studentPlans)
      setLoading(false)
    }, 800)
  }, [params.id])

  if (loading) {
    return <LoadingPage />
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">Aluno não encontrado</h3>
            <p className="text-gray-400 mb-4">O aluno que você está procurando não existe.</p>
            <Link href="/trainer/students">
              <Button>Voltar para Lista de Alunos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const recentWorkouts = [
    { date: "Hoje", plan: "Treino de Força", duration: "45 min", completed: true },
    { date: "Ontem", plan: "Cardio e Resistência", duration: "30 min", completed: true },
    { date: "2 dias atrás", plan: "Treino de Força", duration: "50 min", completed: true },
    { date: "3 dias atrás", plan: "Cardio e Resistência", duration: "35 min", completed: false },
    { date: "4 dias atrás", plan: "Treino de Força", duration: "48 min", completed: true },
  ]

  const progressData = [
    { week: "Sem 1", completed: 3, total: 4 },
    { week: "Sem 2", completed: 4, total: 4 },
    { week: "Sem 3", completed: 2, total: 4 },
    { week: "Sem 4", completed: 4, total: 4 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/trainer/students">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold">{student.name}</h1>
                  <p className="text-sm text-gray-500">Perfil do Aluno</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
              <Link href={`/trainer/create-plan?student=${student.id}`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Plano
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Planos Ativos</CardTitle>
              <Target className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.plansCount}</div>
              <p className="text-xs opacity-80">Em andamento</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Treinos</CardTitle>
              <Activity className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.completedWorkouts}</div>
              <p className="text-xs opacity-80">Concluídos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Progresso</CardTitle>
              <TrendingUp className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((student.completedWorkouts / student.totalWorkouts) * 100)}%
              </div>
              <p className="text-xs opacity-80">Concluído</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tempo Ativo</CardTitle>
              <Clock className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(
                  (new Date().getTime() - new Date(student.joinDate.split("/").reverse().join("-")).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}
              </div>
              <p className="text-xs opacity-80">dias</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="plans">Planos ({plans.length})</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge
                        variant={student.status === "Ativo" ? "default" : "secondary"}
                        className={student.status === "Ativo" ? "bg-green-500" : ""}
                      >
                        {student.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experiência</p>
                      <p className="font-medium">{student.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Objetivo</p>
                      <p className="font-medium">{student.goal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Último Acesso</p>
                      <p className="font-medium text-sm">{student.lastAccess}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Atividade Recente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentWorkouts.slice(0, 5).map((workout, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className={`w-2 h-2 rounded-full ${workout.completed ? "bg-green-500" : "bg-gray-300"}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{workout.plan}</p>
                          <p className="text-xs text-gray-500">{workout.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">{workout.duration}</p>
                          <Badge variant={workout.completed ? "default" : "secondary"} className="text-xs">
                            {workout.completed ? "Concluído" : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            {plans.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {plans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{plan.difficulty}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span className="font-medium">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Duração</p>
                          <p className="font-medium">{plan.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Exercícios</p>
                          <p className="font-medium">{plan.exercises.length}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/trainer/plan/${plan.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Ver Detalhes
                          </Button>
                        </Link>
                        <Button size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">Nenhum plano ativo</h3>
                  <p className="text-gray-400 mb-4">Este aluno ainda não possui planos de treinamento.</p>
                  <Link href={`/trainer/create-plan?student=${student.id}`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Plano
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle>Progresso Semanal</CardTitle>
                  <CardDescription>Treinos concluídos por semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {progressData.map((week, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{week.week}</span>
                          <span className="font-medium">
                            {week.completed}/{week.total}
                          </span>
                        </div>
                        <Progress value={(week.completed / week.total) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conquistas</CardTitle>
                  <CardDescription>Marcos alcançados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Trophy className="h-6 w-6 text-yellow-600" />
                      <div>
                        <p className="font-medium text-sm">Primeira Semana</p>
                        <p className="text-xs text-gray-500">Completou a primeira semana de treinos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Trophy className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Consistência</p>
                        <p className="text-xs text-gray-500">5 dias consecutivos de treino</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Trophy className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Dedicação</p>
                        <p className="text-xs text-gray-500">15 treinos concluídos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Nome</p>
                      <p className="font-medium">{student.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Idade</p>
                      <p className="font-medium">{student.age} anos</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Peso</p>
                      <p className="font-medium">{student.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Altura</p>
                      <p className="font-medium">{student.height}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Data de Cadastro</p>
                    <p className="font-medium">{student.joinDate}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{student.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Restrições Médicas</p>
                    <p className="font-medium">{student.restrictions}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
