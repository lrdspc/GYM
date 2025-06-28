"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Dumbbell, Users, Calendar, Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const FAKE_USERS = {
  trainer: {
    email: "joao.trainer@fitpro.com",
    password: "123456",
    name: "João Silva",
    type: "trainer",
  },
  student: {
    email: "ana.aluna@fitpro.com",
    password: "123456",
    name: "Ana Santos",
    type: "student",
  },
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState("trainer")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleLogin = async () => {
    if (!formData.email || !formData.password) return

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (userType === "trainer") {
      router.push("/trainer/dashboard")
    } else {
      router.push("/student/dashboard")
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.name || formData.password !== formData.confirmPassword)
      return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (userType === "trainer") {
      router.push("/trainer/dashboard")
    } else {
      router.push("/student/dashboard")
    }
    setLoading(false)
  }

  const handleQuickLogin = async (type: "trainer" | "student") => {
    const user = FAKE_USERS[type]
    setFormData({
      email: user.email,
      password: user.password,
      name: user.name,
      confirmPassword: user.password,
    })
    setUserType(type)
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    if (type === "trainer") {
      router.push("/trainer/dashboard")
    } else {
      router.push("/student/dashboard")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Dumbbell className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FitTrainer Pro
          </h1>
          <p className="text-gray-600 mt-2">Sua jornada fitness começa aqui</p>
        </div>

        <Card className="mobile-card shadow-xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="text-center">
              <CardTitle className="text-2xl">{isLogin ? "Entrar" : "Criar Conta"}</CardTitle>
              <CardDescription className="mt-2">
                {isLogin ? "Acesse sua conta para continuar" : "Crie sua conta e comece hoje"}
              </CardDescription>
            </div>

            {/* User Type Selector */}
            <Tabs value={userType} onValueChange={setUserType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="trainer" className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  Personal Trainer
                </TabsTrigger>
                <TabsTrigger value="student" className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Aluno
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mobile-input"
                  disabled={loading}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mobile-input"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mobile-input pr-12"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 w-12 touch-target"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mobile-input"
                  disabled={loading}
                />
              </div>
            )}

            {/* Main Action Button */}
            <Button
              onClick={isLogin ? handleLogin : handleRegister}
              className="w-full mobile-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 haptic-light"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isLogin ? "Entrar" : "Criar Conta"}
            </Button>

            {/* Forgot Password Link */}
            {isLogin && (
              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>
            )}

            <Separator />

            {/* Quick Test Buttons */}
            <div className="space-y-4">
              <p className="text-sm text-center text-gray-500 font-medium">Teste Rápido:</p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => handleQuickLogin("trainer")}
                  className="w-full mobile-button bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 haptic-light"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "👨‍🏋️ Entrar como Personal"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleQuickLogin("student")}
                  className="w-full mobile-button bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 haptic-light"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "🏃‍♀️ Entrar como Aluno"}
                </Button>
              </div>
              <p className="text-xs text-center text-gray-400">Clique para fazer login automático</p>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-blue-600 hover:underline"
                  disabled={loading}
                >
                  {isLogin ? "Cadastre-se" : "Entrar"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Users Link */}
        <div className="text-center mt-6">
          <Link href="/test-users" className="text-sm text-gray-500 hover:text-gray-700">
            Ver credenciais de teste
          </Link>
        </div>
      </div>
    </div>
  )
}
