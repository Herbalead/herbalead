'use client'

import { useState } from 'react'
import { createProfessionalProfile } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

export default function FixUserProfile() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [userInfo, setUserInfo] = useState<Record<string, unknown> | null>(null)

  const checkUser = async () => {
    if (!email) return
    
    setLoading(true)
    setResult('')
    setUserInfo(null)

    try {
      // Verificar se existe na tabela professionals
      const { data: profileData, error: profileError } = await supabase
        .from('professionals')
        .select('*')
        .eq('email', email)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        setResult(`❌ Erro ao verificar perfil: ${profileError.message}`)
        return
      }

      if (profileData) {
        setResult(`✅ Perfil já existe na tabela professionals`)
        setUserInfo(profileData)
      } else {
        setResult(`❌ Perfil NÃO existe na tabela professionals`)
        
        // Tentar buscar dados do usuário logado atual
        const { data: { user } } = await supabase.auth.getUser()
        if (user && user.email === email) {
          setUserInfo({
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata
          })
          setResult(prev => prev + `\n✅ Usuário logado encontrado: ${user.id}`)
        } else {
          setResult(prev => prev + `\n⚠️ Usuário não está logado ou email não confere`)
        }
      }

    } catch (error) {
      console.error('❌ Erro:', error)
      setResult(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async () => {
    if (!userInfo) return
    
    setLoading(true)
    setResult('')

    try {
      const profileData = {
        name: userInfo.user_metadata?.name || userInfo.name || userInfo.email?.split('@')[0] || 'Usuário',
        phone: userInfo.user_metadata?.phone || userInfo.phone || '',
        specialty: userInfo.user_metadata?.specialty || userInfo.specialty || '',
        company: userInfo.user_metadata?.company || userInfo.company || ''
      }

      await createProfessionalProfile(userInfo.id, userInfo.email, profileData)
      setResult('✅ Perfil profissional criado com sucesso!')
      
      // Verificar novamente
      setTimeout(() => {
        checkUser()
      }, 1000)

    } catch (error) {
      console.error('❌ Erro ao criar perfil:', error)
      setResult(`❌ Erro ao criar perfil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Corrigir Perfil de Usuário</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Instruções:</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Faça login com o email que está dando problema</li>
              <li>Digite o mesmo email abaixo</li>
              <li>Clique em &quot;Verificar Usuário&quot;</li>
              <li>Se necessário, clique em &quot;Criar Perfil&quot;</li>
            </ol>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email do usuário *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="usuario@email.com"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={checkUser}
              disabled={loading || !email}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Verificar Usuário'}
            </button>

            {userInfo && !userInfo.name && (
              <button
                onClick={createProfile}
                disabled={loading}
                className="bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar Perfil'}
              </button>
            )}
          </div>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          {userInfo && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-2">Informações do Usuário:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>ID:</strong> {userInfo.id}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Nome:</strong> {userInfo.user_metadata?.name || userInfo.name || 'Não informado'}</p>
                <p><strong>Telefone:</strong> {userInfo.user_metadata?.phone || userInfo.phone || 'Não informado'}</p>
                <p><strong>Especialidade:</strong> {userInfo.user_metadata?.specialty || userInfo.specialty || 'Não informado'}</p>
                <p><strong>Empresa:</strong> {userInfo.user_metadata?.company || userInfo.company || 'Não informado'}</p>
                {userInfo.created_at && (
                  <p><strong>Criado em:</strong> {new Date(userInfo.created_at).toLocaleString()}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
