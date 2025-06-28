"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, User, Mail, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TestUsersPage() {
  const testUsers = [
    {
      type: "Personal Trainer",
      name: "João Silva",
      email: "joao.trainer@fitpro.com",
      password: "123456",
      description: "Personal trainer experiente com 5 anos de atuação",
      features: [
        "Dashboard completo com estatísticas",
        "Gerenciamento de 4 alunos",
        "Sistema de mensagens",
        "Criação de planos de treino",
        "Notificações em tempo real",
      ],
      color: "blue",
    },
    {
      type: "Aluno",
      name: "Ana Santos",
      email: "ana.aluna@fitpro.com",
      password: "123456",
      description: "Aluna iniciante focada em emagrecimento e condicionamento",
      features: [
        "2 planos de treino ativos",
        "Histórico de 19 treinos",
        "Sequência de 7 dias consecutivos",
        "Chat com personal trainer",
        "Acompanhamento de progresso",
      ],
      color: "purple",
    },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Login
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Usuários de Teste</h1>
              <p className="text-sm text-gray-500">Credenciais para testar a aplicação</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instruções */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Como Testar
            </CardTitle>
            <CardDescription>
              Use as credenciais abaixo para explorar as diferentes funcionalidades da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Opção 1: Login Rápido</h4>
                <p className="text-gray-600">
                  Na tela de login, clique nos botões "👨‍🏋️ Personal" ou "🏃‍♀️ Aluno" para login automático
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-800 mb-2">Opção 2: Login Manual</h4>
                <p className="text-gray-600">Copie as credenciais abaixo e cole nos campos de email e senha</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usuários de Teste */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testUsers.map((user, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className={`h-5 w-5 text-${user.color}-600`} />
                    {user.type}
                  </CardTitle>
                  <Badge variant="secondary" className={`bg-${user.color}-100 text-${user.color}-800`}>
                    Teste
                  </Badge>
                </div>
                <CardDescription>{user.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Credenciais */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Credenciais de Acesso</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Nome</p>
                          <p className="text-sm text-gray-600">{user.name}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(user.name)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(user.email)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Senha</p>
                          <p className="text-sm text-gray-600 font-mono">{user.password}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(user.password)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Funcionalidades */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Funcionalidades Disponíveis</h4>
                  <ul className="space-y-2">
                    {user.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 bg-${user.color}-500 rounded-full`}></div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botão de Acesso Direto */}
                <Link href="/" className="block">
                  <Button
                    className={`w-full bg-gradient-to-r from-${user.color}-500 to-${user.color}-600 hover:from-${user.color}-600 hover:to-${user.color}-700`}
                  >
                    Fazer Login como {user.type}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dicas Adicionais */}
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">💡 Dicas para Teste</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-700 space-y-2">
            <p>
              • <strong>Personal Trainer:</strong> Explore o dashboard, crie planos, gerencie alunos e use o sistema de
              mensagens
            </p>
            <p>
              • <strong>Aluno:</strong> Visualize seus planos, marque exercícios como concluídos e converse com seu
              personal
            </p>
            <p>
              • <strong>Navegação:</strong> Use os botões "Voltar" para navegar entre as telas
            </p>
            <p>
              • <strong>Responsividade:</strong> Teste em diferentes tamanhos de tela (mobile, tablet, desktop)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
