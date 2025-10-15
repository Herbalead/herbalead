// Script para resetar senha da Juliana via API administrativa
async function resetJulianaPassword() {
  try {
    console.log('🔄 Resetando senha da Juliana via API administrativa...')
    
    const response = await fetch('https://www.herbalead.com/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reset_password',
        userId: 'af6ba68f-8e46-4c60-8e9d-3d3d56652c59'
      })
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('✅ Senha resetada com sucesso!')
      console.log('📧 Email:', 'juliana.bortolazzo@hotmail.com')
      console.log('🔑 Nova senha:', 'HerbaLead2024!')
      console.log('📝 Mensagem:', result.message)
    } else {
      console.error('❌ Erro ao resetar senha:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Erro de rede:', error)
  }
}

resetJulianaPassword()
