'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Eye, EyeOff, Loader2, User, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    }
    getUser();
  }, [supabase, router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Senha alterada com sucesso!');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Configurações de Perfil</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Informações do usuário */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações da Conta</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">ID do Usuário</label>
                  <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Membro desde</label>
                  <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>

            {/* Alterar senha */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <KeyRound className="h-5 w-5 text-green-600 mr-2" />
                Alterar Senha
              </h2>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha *
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {newPassword && newPassword.length < 6 && (
                    <p className="text-red-500 text-xs mt-1">A senha deve ter pelo menos 6 caracteres.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha *
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-red-500 text-xs mt-1">As senhas não coincidem.</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Alterar Senha'}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/user" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
