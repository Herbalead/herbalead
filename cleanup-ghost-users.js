// Script para limpar usuários fantasma do Supabase
// Execute este script no console do navegador na página de admin do Supabase

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjwuedzmapeozijjrcik.supabase.co'
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY' // Substitua pela sua service key

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function cleanupGhostUsers() {
  try {
    console.log('🧹 Iniciando limpeza de usuários fantasma...')
    
    // Buscar todos os usuários do auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Erro ao buscar usuários do auth:', authError)
      return
    }

    console.log(`📊 Total de usuários no auth: ${users?.length || 0}`)

    // Buscar todos os profissionais
    const { data: professionals, error: profError } = await supabase
      .from('professionals')
      .select('id, email')

    if (profError) {
      console.error('❌ Erro ao buscar profissionais:', profError)
      return
    }

    console.log(`📊 Total de profissionais: ${professionals?.length || 0}`)

    const professionalIds = new Set(professionals?.map(p => p.id) || [])
    
    // Identificar usuários fantasma
    const ghostUsers = users?.filter(user => !professionalIds.has(user.id)) || []
    
    console.log(`🔍 Encontrados ${ghostUsers.length} usuários fantasma:`)
    ghostUsers.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id})`)
    })
    
    if (ghostUsers.length === 0) {
      console.log('✅ Nenhum usuário fantasma encontrado!')
      return
    }
    
    // Confirmar antes de deletar
    const confirmDelete = confirm(`Deseja deletar ${ghostUsers.length} usuários fantasma?`)
    if (!confirmDelete) {
      console.log('❌ Operação cancelada pelo usuário')
      return
    }
    
    // Deletar usuários fantasma do auth
    let deletedCount = 0
    for (const user of ghostUsers) {
      try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
        if (deleteError) {
          console.error(`❌ Erro ao deletar usuário fantasma ${user.email}:`, deleteError)
        } else {
          console.log(`✅ Usuário fantasma deletado: ${user.email}`)
          deletedCount++
        }
      } catch (deleteError) {
        console.error(`❌ Erro ao deletar usuário fantasma ${user.email}:`, deleteError)
      }
    }
    
    console.log(`✅ Limpeza concluída! ${deletedCount} usuários fantasma deletados.`)
  } catch (error) {
    console.error('❌ Erro na limpeza de usuários fantasma:', error)
  }
}

// Executar a limpeza
cleanupGhostUsers()
