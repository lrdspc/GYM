"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Dumbbell, Users, Calendar, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useFormState } from "@/hooks/useOptimizedState"
import { LoadingButton } from "@/components/ui/loading-states"
import { Alert, AlertDescription } from "@/components/ui/alert"

const FAKE_USERS = {
  trainer: {
    email: "joao.trainer@fitpro.com",
    password: "123456",
    name: "João Silva",
    type: "trainer" as const,
  },
  student: {
    email: "ana.aluna@fitpro.com",
    password: "123456",
    name: "Ana Santos",
    type: "student" as const,
  },
}

const validateForm = (values: any, isLogin: boolean) => {
  const errors: Record<string, string> = {}

  if (!values.email) {
    errors.email = 'Email é obrigatório'
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email inválido'
  }

  if (!values.password) {
    errors.password = 'Senha é obrigatória'
  } else if (!isLogin && values.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
  }

  if (!isLogin) {
    if (!values.name) {
      errors.name = 'Nome é obrigatório'
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem'
    }
  }

  return errors
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'trainer' | 'student'>('trainer')
  const [authError, setAuthError] = useState<string>('')
  
  const { login, register, isLoading } = useAuth()

  const initialValues = useMemo(() => ({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  }), [])

  const {
    values: formData,
    errors,
    setValue,
    validate,
    reset
  } = useFormState(initialValues, (values) => validateForm(values, isLogin))

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    if (!validate()) {
      return
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password, userType)
      } else {
        await register({
          ...formData,
          userType
        })
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erro na autenticação')
    }
  }, [formData, isLogin, userType, login, register, validate])

  const handleQuickLogin = useCallback(async (type: 'trainer' | 'student') => {
    setAuthError('')
    const user = FAKE_USERS[type]
    
    try {
      await login(user.email, user.password, user.type)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Erro no login rápido')
    }
  }, [login])

  const toggleAuthMode = useCallback(() => {
    setIsLogin(!isLogin)
    setAuthError('')
    reset()
  }, [isLogin, reset])

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
            <Tabs value={userType} onValueChange={(value) => setUserType(value as 'trainer' | 'student')} className="w-full">
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
            {/* Error Alert */}
            {authError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setValue('name', e.target.value)}
                    className={`mobile-input ${errors.name ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-red-500">{errors.name}</p>
                  )}
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
                  onChange={(e) => setValue('email', e.target.value)}
                  className={`mobile-input ${errors.email ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500">{errors.email}</p>
                )}
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
                    onChange={(e) => setValue('password', e.target.value)}
                    className={`mobile-input pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 w-12 touch-target"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-500">{errors.password}</p>
                )}
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
                    onChange={(e) => setValue('confirmPassword', e.target.value)}
                    className={`mobile-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  />
                  {errors.confirmPassword && (
                    <p id="confirm-password-error" className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Main Action Button */}
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText={isLogin ? "Entrando..." : "Criando conta..."}
                className="w-full mobile-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 haptic-light text-white"
              >
                {isLogin ? "Entrar" : "Criar Conta"}
              </LoadingButton>
            </form>

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
                <LoadingButton
                  onClick={() => handleQuickLogin("trainer")}
                  isLoading={isLoading}
                  className="w-full mobile-button bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 haptic-light"
                >
                  👨‍🏋️ Entrar como Personal
                </LoadingButton>
                <LoadingButton
                  onClick={() => handleQuickLogin("student")}
                  isLoading={isLoading}
                  className="w-full mobile-button bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 haptic-light"
                >
                  🏃‍♀️ Entrar como Aluno
                </LoadingButton>
              </div>
              <p className="text-xs text-center text-gray-400">Clique para fazer login automático</p>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="font-semibold text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  disabled={isLoading}
                >
                  {isLogin ? "Cadastre-se" : "Entrar"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Users Link */}
        <div className="text-center mt-6">
          <Link href="/test-users" className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded">
            Ver credenciais de teste
          </Link>
        </div>
      </div>
    </div>
  )
}