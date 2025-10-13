// Script para testar o problema do telefone fixo
// Execute este script no console do navegador quando estiver em uma calculadora

console.log('🔍 TESTE DO PROBLEMA DO TELEFONE FIXO');
console.log('=====================================');

// 1. Verificar se useUserData está funcionando
if (typeof window !== 'undefined') {
  // Simular dados de usuário para teste
  const testUserData = {
    userId: 'test-user-id',
    userName: 'Teste Usuário',
    userPhone: '5511999999999', // Telefone de teste
    linkId: 'test-link-id',
    customMessage: 'Mensagem personalizada de teste!'
  };
  
  console.log('📋 Dados de teste:', testUserData);
  
  // 2. Testar URL do WhatsApp
  const testMessage = testUserData.customMessage || 'Mensagem padrão';
  const cleanPhone = testUserData.userPhone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(testMessage)}`;
  
  console.log('📱 URL do WhatsApp gerada:', whatsappUrl);
  
  // 3. Verificar se há dados na URL atual
  const urlParams = new URLSearchParams(window.location.search);
  const userParam = urlParams.get('user');
  
  if (userParam) {
    try {
      const parsedUserData = JSON.parse(userParam);
      console.log('✅ Dados encontrados na URL:', parsedUserData);
      console.log('📞 Telefone na URL:', parsedUserData.userPhone);
      console.log('💬 Mensagem na URL:', parsedUserData.customMessage);
    } catch (error) {
      console.error('❌ Erro ao parsear dados da URL:', error);
    }
  } else {
    console.log('⚠️ Nenhum dado de usuário encontrado na URL');
  }
  
  // 4. Verificar se há elementos de debug no console
  console.log('🔍 Verifique os logs acima para identificar o problema');
  console.log('=====================================');
}
