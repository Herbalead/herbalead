'use client'

import Link from 'next/link'

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">
                Herbalead
              </Link>
              </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Usuário</span>
              <Link href="/login" className="text-gray-500 hover:text-gray-700">
                Sair
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard do Usuário</h2>
          <p className="text-gray-600 mb-6">
            Sistema em desenvolvimento. Funcionalidades avançadas serão implementadas em breve.
          </p>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Status</h3>
            <p className="text-green-700">
              Sistema funcionando corretamente.
            </p>
    </div>
  </div>
</main>
    </div>
  )
}
