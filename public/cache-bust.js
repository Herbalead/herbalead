// Cache busting script
console.log('🔄 Cache busting ativo - versão nova carregada!');
console.log('Timestamp:', new Date().toISOString());

// Forçar reload se detectar cache antigo
if (localStorage.getItem('herbalead-old-version')) {
  localStorage.removeItem('herbalead-old-version');
  window.location.reload();
}

// Marcar versão atual
localStorage.setItem('herbalead-version', 'new-' + Date.now());

