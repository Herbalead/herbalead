// Script para resetar senha da Juliana via API
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.log('Certifique-se de ter NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetJulianaPassword() {
  try {
    console.log('🔄 Resetando senha da Juliana...')
    
    const userId = 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59'
    const newPassword = 'HerbaLead2024!'
    
    // Resetar senha usando Supabase Admin
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    )

    if (error) {
      console.error('❌ Erro ao resetar senha:', error)
      return
    }

    console.log('✅ Senha resetada com sucesso!')
    console.log('📧 Email:', 'juliana.bortolazzo@hotmail.com')
    console.log('🔑 Nova senha:', newPassword)
    console.log('👤 Usuário:', data.user?.email)
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
  }
}

resetJulianaPassword()
