"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  Target,
  MoreVertical,
  MessageCircle,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { MOCK_STUDENTS } from "@/lib/mock-data"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    weight: "",
    height: "",
    goal: "",
    restrictions: "",
    experience: "",
  })

  const [students, setStudents] = useState(MOCK_STUDENTS)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!newStudent.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!newStudent.email.trim()) newErrors.email = "Email é obrigatório"
    if (newStudent.email && !/\S+@\S+\.\S+/.test(newStudent.email)) {
      newErrors.email = "Email inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddStudent = async () => {
    if (validateForm()) {
      setSubmitting(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Novo aluno:", newStudent)
      setIsAddDialogOpen(false)
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        age: "",
        weight: "",
        height: "",
        goal: "",
        restrictions: "",
        experience: "",
      })
      setErrors({})
      setSubmitting(false)
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || student.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">Carregando alunos...</p>
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
            <Link href="/trainer/dashboard">
              <Button variant="ghost" size="sm" className="touch-target">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="text-center flex-1 mx-4">
              <h1 className="text-lg font-semibold">Gerenciar Alunos</h1>
              <p className="text-sm text-gray-500">{students.length} alunos cadastrados</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 touch-target">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="mobile-container max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Aluno</DialogTitle>
                  <DialogDescription>Preencha as informações do novo aluno</DialogDescription>
                </DialogHeader>

                <div className="mobile-stack py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      placeholder="Nome do aluno"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      className={`mobile-input ${errors.name ? "border-red-500" : ""}`}
                      disabled={submitting}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className={`mobile-input ${errors.email ? "border-red-500" : ""}`}
                      disabled={submitting}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="mobile-grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                        className="mobile-input"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Idade</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={newStudent.age}
                        onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                        className="mobile-input"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="mobile-grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso</Label>
                      <Input
                        id="weight"
                        placeholder="70kg"
                        value={newStudent.weight}
                        onChange={(e) => setNewStudent({ ...newStudent, weight: e.target.value })}
                        className="mobile-input"
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Altura</Label>
                      <Input
                        id="height"
                        placeholder="1.75m"
                        value={newStudent.height}
                        onChange={(e) => setNewStudent({ ...newStudent, height: e.target.value })}
                        className="mobile-input"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Objetivo</Label>
                    <Select
                      value={newStudent.goal}
                      onValueChange={(value) => setNewStudent({ ...newStudent, goal: value })}
                      disabled={submitting}
                    >
                      <SelectTrigger className="mobile-input">
                        <SelectValue placeholder="Selecione o objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                        <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                        <SelectItem value="condicionamento">Condicionamento</SelectItem>
                        <SelectItem value="forca">Força</SelectItem>
                        <SelectItem value="reabilitacao">Reabilitação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Nível de Experiência</Label>
                    <Select
                      value={newStudent.experience}
                      onValueChange={(value) => setNewStudent({ ...newStudent, experience: value })}
                      disabled={submitting}
                    >
                      <SelectTrigger className="mobile-input">
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restrictions">Restrições Médicas</Label>
                    <Textarea
                      id="restrictions"
                      placeholder="Descreva qualquer restrição médica..."
                      value={newStudent.restrictions}
                      onChange={(e) => setNewStudent({ ...newStudent, restrictions: e.target.value })}
                      rows={3}
                      className="resize-none"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1 mobile-button"
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddStudent}
                    disabled={submitting}
                    className="flex-1 mobile-button haptic-light"
                  >
                    {submitting ? <LoadingSpinner size="sm" /> : "Adicionar Aluno"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 mobile-stack">
        {/* Search and Filters */}
        <Card className="mobile-card">
          <CardContent className="py-4">
            <div className="mobile-stack">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mobile-input pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="mobile-input">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <div className="mobile-stack">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="mobile-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{student.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={student.status === "Ativo" ? "default" : "secondary"}
                          className={`text-xs ${student.status === "Ativo" ? "bg-green-500" : ""}`}
                        >
                          {student.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {student.experience}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="touch-target">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover Aluno
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="mobile-stack">
                {/* Contact Info */}
                <div className="mobile-grid gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{student.age} anos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span>{student.goal}</span>
                  </div>
                </div>

                {/* Physical Stats */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="mobile-grid gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Peso:</span>
                      <span className="font-medium ml-1">{student.weight}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Altura:</span>
                      <span className="font-medium ml-1">{student.height}</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progresso</span>
                    <span className="font-medium">
                      {student.completedWorkouts}/{student.totalWorkouts} treinos
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: `${(student.completedWorkouts / student.totalWorkouts) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Last Activity */}
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Último acesso: {student.lastAccess}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link href={`/trainer/student/${student.id}`} className="flex-1">
                    <Button variant="outline" className="w-full mobile-button bg-transparent haptic-light">
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Link href={`/trainer/create-plan?student=${student.id}`} className="flex-1">
                    <Button className="w-full mobile-button haptic-light">Criar Plano</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <Card className="mobile-card text-center py-12">
            <CardContent>
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Nenhum aluno encontrado</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Adicione seu primeiro aluno para começar"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button onClick={() => setIsAddDialogOpen(true)} className="mobile-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Aluno
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
