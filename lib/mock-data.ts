export interface Student {
  id: number
  name: string
  email: string
  phone: string
  age: number
  weight: string
  height: string
  goal: string
  experience: string
  plansCount: number
  lastAccess: string
  status: "Ativo" | "Inativo"
  completedWorkouts: number
  totalWorkouts: number
  joinDate: string
  restrictions: string
  avatar?: string
}

export interface TrainingPlan {
  id: number
  name: string
  trainer: string
  description: string
  duration: string
  progress: number
  exercises: Exercise[]
  studentId: number
  startDate: string
  difficulty: string
  nextWorkout: string
  completedWorkouts: number
  totalWorkouts: number
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  weight: string
  rest: string
  notes: string
}

export interface Message {
  id: number
  content: string
  sender: "trainer" | "student"
  time: string
  status: "sent" | "delivered" | "read"
  timestamp: Date
}

export interface Conversation {
  id: number
  studentId: number
  studentName: string
  studentAvatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  messages: Message[]
}

export interface Notification {
  id: number
  type: "workout" | "message" | "new_student" | "achievement" | "plan"
  message: string
  time: string
  read: boolean
  userId: number
  userType: "trainer" | "student"
}

// Dados centralizados
export const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Ana Silva",
    email: "ana@email.com",
    phone: "(11) 99999-9999",
    age: 28,
    weight: "65kg",
    height: "1.65m",
    goal: "Emagrecimento",
    experience: "Iniciante",
    plansCount: 2,
    lastAccess: "Hoje às 14:30",
    status: "Ativo",
    completedWorkouts: 15,
    totalWorkouts: 20,
    joinDate: "15/01/2024",
    restrictions: "Nenhuma",
  },
  {
    id: 2,
    name: "Carlos Santos",
    email: "carlos@email.com",
    phone: "(11) 88888-8888",
    age: 35,
    weight: "80kg",
    height: "1.78m",
    goal: "Hipertrofia",
    experience: "Intermediário",
    plansCount: 1,
    lastAccess: "Ontem às 19:15",
    status: "Ativo",
    completedWorkouts: 8,
    totalWorkouts: 12,
    joinDate: "22/01/2024",
    restrictions: "Problema no joelho esquerdo",
  },
  {
    id: 3,
    name: "Maria Oliveira",
    email: "maria@email.com",
    phone: "(11) 77777-7777",
    age: 42,
    weight: "58kg",
    height: "1.60m",
    goal: "Condicionamento",
    experience: "Avançado",
    plansCount: 3,
    lastAccess: "2 dias atrás",
    status: "Inativo",
    completedWorkouts: 25,
    totalWorkouts: 36,
    joinDate: "08/01/2024",
    restrictions: "Pressão alta",
  },
  {
    id: 4,
    name: "João Costa",
    email: "joao@email.com",
    phone: "(11) 66666-6666",
    age: 24,
    weight: "70kg",
    height: "1.75m",
    goal: "Força",
    experience: "Iniciante",
    plansCount: 1,
    lastAccess: "3 dias atrás",
    status: "Ativo",
    completedWorkouts: 4,
    totalWorkouts: 8,
    joinDate: "28/01/2024",
    restrictions: "Nenhuma",
  },
]

export const MOCK_TRAINING_PLANS: TrainingPlan[] = [
  {
    id: 1,
    name: "Treino de Força - Iniciante",
    trainer: "Personal João",
    description:
      "Plano focado no desenvolvimento de força muscular para iniciantes, com exercícios básicos e progressão gradual.",
    duration: "8 semanas",
    progress: 65,
    studentId: 1,
    startDate: "2024-01-15",
    difficulty: "Iniciante",
    nextWorkout: "Peito e Tríceps",
    completedWorkouts: 13,
    totalWorkouts: 20,
    exercises: [
      {
        id: "1",
        name: "Supino Reto",
        sets: 3,
        reps: "8-12",
        weight: "60kg",
        rest: "90s",
        notes: "Manter controle na descida, explosão na subida",
      },
      {
        id: "2",
        name: "Agachamento Livre",
        sets: 4,
        reps: "10-15",
        weight: "40kg",
        rest: "2min",
        notes: "Descer até 90 graus, manter joelhos alinhados",
      },
      {
        id: "3",
        name: "Remada Curvada",
        sets: 3,
        reps: "8-12",
        weight: "50kg",
        rest: "90s",
        notes: "Puxar até o abdômen, apertar as escápulas",
      },
      {
        id: "4",
        name: "Desenvolvimento Militar",
        sets: 3,
        reps: "8-10",
        weight: "30kg",
        rest: "90s",
        notes: "Não arquear as costas, core contraído",
      },
      {
        id: "5",
        name: "Levantamento Terra",
        sets: 3,
        reps: "6-8",
        weight: "70kg",
        rest: "2min",
        notes: "Manter coluna neutra, força nas pernas",
      },
    ],
  },
  {
    id: 2,
    name: "Cardio e Resistência",
    trainer: "Personal João",
    description: "Treino focado em melhorar o condicionamento cardiovascular e resistência muscular.",
    duration: "4 semanas",
    progress: 30,
    studentId: 1,
    startDate: "2024-02-01",
    difficulty: "Intermediário",
    nextWorkout: "HIIT Funcional",
    completedWorkouts: 6,
    totalWorkouts: 20,
    exercises: [
      {
        id: "6",
        name: "Burpees",
        sets: 4,
        reps: "10-15",
        weight: "Peso corporal",
        rest: "45s",
        notes: "Movimento explosivo, manter ritmo constante",
      },
      {
        id: "7",
        name: "Mountain Climbers",
        sets: 3,
        reps: "30s",
        weight: "Peso corporal",
        rest: "30s",
        notes: "Manter core contraído, movimento rápido",
      },
      {
        id: "8",
        name: "Jump Squats",
        sets: 4,
        reps: "12-20",
        weight: "Peso corporal",
        rest: "60s",
        notes: "Aterrissagem suave, explosão na subida",
      },
    ],
  },
]

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "Ana Silva",
    lastMessage: "Obrigada pela explicação sobre o exercício!",
    lastMessageTime: "10:30",
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        content: "Oi! Tenho uma dúvida sobre o supino reto",
        sender: "student",
        time: "09:45",
        status: "read",
        timestamp: new Date("2024-01-20T09:45:00"),
      },
      {
        id: 2,
        content: "Oi Ana! Claro, qual é sua dúvida?",
        sender: "trainer",
        time: "09:47",
        status: "read",
        timestamp: new Date("2024-01-20T09:47:00"),
      },
      {
        id: 3,
        content: "Não estou conseguindo sentir trabalhar o peitoral direito",
        sender: "student",
        time: "09:50",
        status: "read",
        timestamp: new Date("2024-01-20T09:50:00"),
      },
      {
        id: 4,
        content:
          "Entendo. Tente ajustar a pegada, deixando as mãos um pouco mais abertas. Também foque em apertar bem o peitoral na subida da barra.",
        sender: "trainer",
        time: "09:52",
        status: "read",
        timestamp: new Date("2024-01-20T09:52:00"),
      },
      {
        id: 5,
        content: "Obrigada pela explicação sobre o exercício!",
        sender: "student",
        time: "10:30",
        status: "read",
        timestamp: new Date("2024-01-20T10:30:00"),
      },
    ],
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Carlos Santos",
    lastMessage: "Posso aumentar a carga do agachamento?",
    lastMessageTime: "Ontem",
    unreadCount: 2,
    isOnline: false,
    messages: [
      {
        id: 1,
        content: "Olá! Como vai?",
        sender: "student",
        time: "14:20",
        status: "read",
        timestamp: new Date("2024-01-19T14:20:00"),
      },
      {
        id: 2,
        content: "Tudo bem, Carlos! E você?",
        sender: "trainer",
        time: "14:25",
        status: "read",
        timestamp: new Date("2024-01-19T14:25:00"),
      },
      {
        id: 3,
        content: "Posso aumentar a carga do agachamento?",
        sender: "student",
        time: "16:45",
        status: "delivered",
        timestamp: new Date("2024-01-19T16:45:00"),
      },
      {
        id: 4,
        content: "Estou achando muito fácil as 15 repetições",
        sender: "student",
        time: "16:46",
        status: "delivered",
        timestamp: new Date("2024-01-19T16:46:00"),
      },
    ],
  },
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "workout",
    message: "Ana Silva concluiu o treino de Peito e Tríceps",
    time: "10 min atrás",
    read: false,
    userId: 1,
    userType: "trainer",
  },
  {
    id: 2,
    type: "message",
    message: "Carlos Santos enviou uma mensagem",
    time: "30 min atrás",
    read: false,
    userId: 1,
    userType: "trainer",
  },
  {
    id: 3,
    type: "new_student",
    message: "Novo aluno se cadastrou: Pedro Lima",
    time: "2 horas atrás",
    read: true,
    userId: 1,
    userType: "trainer",
  },
  {
    id: 4,
    type: "plan",
    message: "Novo plano de treino disponível!",
    time: "2 horas atrás",
    read: false,
    userId: 1,
    userType: "student",
  },
  {
    id: 5,
    type: "achievement",
    message: "Parabéns! Você completou 5 dias consecutivos!",
    time: "2 dias atrás",
    read: true,
    userId: 1,
    userType: "student",
  },
]

// Funções utilitárias
export const getStudentById = (id: number): Student | undefined => {
  return MOCK_STUDENTS.find((student) => student.id === id)
}

export const getPlansByStudentId = (studentId: number): TrainingPlan[] => {
  return MOCK_TRAINING_PLANS.filter((plan) => plan.studentId === studentId)
}

export const getConversationByStudentId = (studentId: number): Conversation | undefined => {
  return MOCK_CONVERSATIONS.find((conv) => conv.studentId === studentId)
}

export const getNotificationsByUser = (userId: number, userType: "trainer" | "student"): Notification[] => {
  return MOCK_NOTIFICATIONS.filter((notif) => notif.userId === userId && notif.userType === userType)
}
