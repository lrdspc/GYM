import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
      <div className="mb-6 p-4 bg-blue-100 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Você está offline</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Não foi possível conectar à internet. Verifique sua conexão ou acesse o conteúdo disponível offline.
      </p>
      
      <div className="grid gap-4 w-full max-w-md">
        <Link 
          href="/"
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center hover:bg-gray-50 transition-colors"
        >
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Página Inicial</h3>
            <p className="text-sm text-gray-500">Voltar para a página inicial</p>
          </div>
        </Link>
        
        <Link 
          href="/trainer/dashboard"
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center hover:bg-gray-50 transition-colors"
        >
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Dashboard</h3>
            <p className="text-sm text-gray-500">Acessar seu dashboard</p>
          </div>
        </Link>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>Algumas funcionalidades podem estar limitadas no modo offline.</p>
      </div>
    </div>
  );
}
