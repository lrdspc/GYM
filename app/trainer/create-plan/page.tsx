"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  weight: string
  rest: string
  notes: string
}

export default function CreatePlan() {
  const router = useRouter()
  const [planName, setPlanName] = useState("")
  const [planDescription, setPlanDescription] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [planDuration, setPlanDuration] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])

  const students = [
    { id: "1", name: "Ana Silva" },
    { id: "2", name: "Carlos Santos" },
    { id: "3", name: "Maria Oliveira" },
    { id: "4", name: "João Costa" },
  ]

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      sets: 3,
      reps: "",
      weight: "",
      rest: "",
      notes: "",
    }
    setExercises([...exercises, newExercise])
  }

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)))
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const savePlan = () => {
    // Aqui você salvaria o plano no banco de dados
    console.log({
      planName,
      planDescription,
      selectedStudent,
      planDuration,
      exercises,
    })
    router.push("/trainer/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/trainer/dashboard">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Criar Novo Plano de Treinamento</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Plano</CardTitle>
            <CardDescription>Configure as informações básicas do plano de treinamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Nome do Plano</Label>
              <Input
                id="plan-name"
                placeholder="Ex: Treino de Força - Iniciante"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student">Aluno</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração do Plano</Label>
              <Select value={planDuration} onValueChange={setPlanDuration}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4weeks">4 semanas</SelectItem>
                  <SelectItem value="8weeks">8 semanas</SelectItem>
                  <SelectItem value="12weeks">12 semanas</SelectItem>
                  <SelectItem value="16weeks">16 semanas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva os objetivos e características deste plano..."
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Exercises */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Exercícios</CardTitle>
                <CardDescription>Adicione os exercícios que compõem este plano</CardDescription>
              </div>
              <Button onClick={addExercise} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Exercício
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum exercício adicionado ainda.</p>
                <p className="text-sm">Clique em "Adicionar Exercício" para começar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">Exercício {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(exercise.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Nome do Exercício</Label>
                      <Input
                        placeholder="Ex: Supino reto"
                        value={exercise.name}
                        onChange={(e) => updateExercise(exercise.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Séries</Label>
                      <Input
                        type="number"
                        placeholder="3"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(exercise.id, "sets", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Repetições</Label>
                      <Input
                        placeholder="8-12"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(exercise.id, "reps", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Peso/Carga</Label>
                      <Input
                        placeholder="60kg"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(exercise.id, "weight", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descanso</Label>
                      <Input
                        placeholder="60s"
                        value={exercise.rest}
                        onChange={(e) => updateExercise(exercise.id, "rest", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Textarea
                        placeholder="Instruções específicas para este exercício..."
                        value={exercise.notes}
                        onChange={(e) => updateExercise(exercise.id, "notes", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button onClick={savePlan} className="flex items-center gap-2" size="lg">
            <Save className="h-4 w-4" />
            Salvar Plano
          </Button>
        </div>
      </div>
    </div>
  )
}
