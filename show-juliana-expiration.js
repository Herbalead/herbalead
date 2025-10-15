// Script para mostrar onde encontrar a data de vencimento da Juliana
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://your-project.supabase.co', // Substitua pela sua URL
  'your-service-role-key' // Substitua pela sua chave
)

async function showJulianaExpiration() {
  console.log('📅 Verificando data de vencimento da Juliana...')
  
  try {
    // 1. Buscar Juliana
    const { data: professionals, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .ilike('email', '%julianazr94%')
    
    if (profError || !professionals || professionals.length === 0) {
      console.error('❌ Juliana não encontrada')
      return
    }
    
    const juliana = professionals[0]
    console.log('👤 Juliana:', juliana.name, '(' + juliana.email + ')')
    
    // 2. Buscar assinaturas
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', juliana.id)
    
    if (subError) {
      console.error('❌ Erro ao buscar assinaturas:', subError)
      return
    }
    
    if (!subscriptions || subscriptions.length === 0) {
      console.log('❌ Nenhuma assinatura encontrada')
      console.log('🔧 Solução: Criar assinatura manualmente')
      return
    }
    
    // 3. Mostrar datas de vencimento
    subscriptions.forEach((sub, index) => {
      console.log(`\n📋 Assinatura ${index + 1}:`)
      console.log('  - Status:', sub.status)
      console.log('  - Plano:', sub.plan_type)
      console.log('  - Início do período:', new Date(sub.current_period_start).toLocaleDateString('pt-BR'))
      console.log('  - Fim do período:', new Date(sub.current_period_end).toLocaleDateString('pt-BR'))
      console.log('  - Cancelar no fim:', sub.cancel_at_period_end ? 'Sim' : 'Não')
      
      // Calcular dias restantes
      const now = new Date()
      const endDate = new Date(sub.current_period_end)
      const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
      
      if (daysLeft > 0) {
        console.log('  - Dias restantes:', daysLeft)
      } else {
        console.log('  - ⚠️ ASSINATURA VENCIDA!')
      }
    })
    
    // 4. Verificar período de graça
    if (juliana.grace_period_end) {
      const graceEnd = new Date(juliana.grace_period_end)
      const now = new Date()
      const graceDaysLeft = Math.ceil((graceEnd - now) / (1000 * 60 * 60 * 24))
      
      console.log('\n⏰ Período de Graça:')
      console.log('  - Fim do período:', graceEnd.toLocaleDateString('pt-BR'))
      console.log('  - Dias restantes:', graceDaysLeft > 0 ? graceDaysLeft : 'Vencido')
    }
    
    console.log('\n📍 Onde encontrar no painel admin:')
    console.log('1. Acesse /admin/subscriptions')
    console.log('2. Clique na aba "Usuários"')
    console.log('3. Procure por "Juliana Bortolazzo"')
    console.log('4. A coluna "PERÍODO DE GRAÇA" mostra a data')
    console.log('5. Ou clique em "Ações" > "Ver detalhes"')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar verificação
showJulianaExpiration()
