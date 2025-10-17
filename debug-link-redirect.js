// Script para debugar problemas de redirecionamento de links
console.log('🔍 DEBUG: Problemas de Redirecionamento de Links');
console.log('=====================================');

// 1. Verificar se há dados no localStorage
if (typeof window !== 'undefined') {
  console.log('📱 Verificando localStorage:');
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('user') || key.includes('phone') || key.includes('whatsapp')) {
      console.log(`  - ${key}:`, localStorage.getItem(key));
    }
  });
  
  // 2. Verificar URL atual
  console.log('🌐 URL atual:', window.location.href);
  console.log('🔍 Parâmetros da URL:', window.location.search);
  
  // 3. Verificar se há dados de usuário na URL
  const urlParams = new URLSearchParams(window.location.search);
  const userParam = urlParams.get('user');
  
  if (userParam) {
    try {
      const userData = JSON.parse(userParam);
      console.log('👤 Dados do usuário na URL:', userData);
      console.log('📞 Telefone:', userData.userPhone);
      console.log('💬 Mensagem:', userData.customMessage);
      console.log('🔧 Tool Name:', userData.toolName || 'Não especificado');
    } catch (error) {
      console.error('❌ Erro ao parsear dados da URL:', error);
    }
  } else {
    console.log('⚠️ Nenhum dado de usuário encontrado na URL');
  }
  
  // 4. Verificar se há elementos de debug no DOM
  console.log('🔍 Elementos de debug no DOM:');
  const debugElements = document.querySelectorAll('[data-debug], [class*="debug"]');
  debugElements.forEach((el, index) => {
    console.log(`  - Elemento ${index + 1}:`, el.textContent?.substring(0, 100));
  });
  
  // 5. Verificar se há scripts de debug
  console.log('📜 Scripts de debug encontrados:');
  const scripts = document.querySelectorAll('script');
  scripts.forEach((script, index) => {
    if (script.textContent?.includes('debug') || script.textContent?.includes('console.log')) {
      console.log(`  - Script ${index + 1}:`, script.textContent?.substring(0, 200));
    }
  });
}

console.log('=====================================');
console.log('✅ Debug completo! Verifique os logs acima.');
