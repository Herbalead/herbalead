// Script para debug do problema da Jessica - Execute no console do navegador
// Acesse: https://herbalead.com/admin e execute este script

console.log('🔍 Investigando problema de cadastro da Jessica...');

// Função para verificar usuários órfãos
async function debugJessicaSignup() {
    try {
        console.log('📊 Verificando registros da Jessica...');
        
        // 1. Verificar na tabela professionals
        const { data: professionals, error: profError } = await supabase
            .from('professionals')
            .select('*')
            .or('name.ilike.%jessica%,name.ilike.%jess%,email.ilike.%jessica%,email.ilike.%jess%');
        
        if (profError) {
            console.error('❌ Erro ao buscar professionals:', profError);
        } else {
            console.log('👥 Registros na tabela professionals:', professionals);
        }
        
        // 2. Verificar usuários ativos no auth (via API)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
            console.error('❌ Erro ao verificar auth:', authError);
        } else {
            console.log('🔐 Usuário atual:', user);
        }
        
        // 3. Tentar fazer login com email da Jessica para ver a mensagem de erro
        const testEmail = 'jessica@teste.com'; // Substitua pelo email real da Jessica
        console.log(`🧪 Testando login com: ${testEmail}`);
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: 'senha_teste_123'
        });
        
        if (loginError) {
            console.log('📝 Erro de login (esperado):', loginError.message);
            
            // Analisar o tipo de erro
            if (loginError.message.includes('Invalid login credentials')) {
                console.log('✅ Usuário não existe ou senha incorreta');
            } else if (loginError.message.includes('Email not confirmed')) {
                console.log('⚠️ Email não confirmado - usuário existe mas não ativo');
            } else {
                console.log('❓ Outro tipo de erro:', loginError.message);
            }
        } else {
            console.log('✅ Login bem-sucedido:', loginData);
        }
        
        // 4. Verificar se há registros órfãos
        if (professionals && professionals.length > 0) {
            console.log('🚨 PROBLEMA ENCONTRADO:');
            console.log('Registros órfãos na tabela professionals:', professionals);
            console.log('💡 SOLUÇÃO: Deletar estes registros órfãos');
            
            // Mostrar botão para deletar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️ Deletar Registros Órfãos da Jessica';
            deleteButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                z-index: 9999;
                font-size: 14px;
            `;
            
            deleteButton.onclick = async () => {
                if (confirm('⚠️ Tem certeza que deseja deletar os registros órfãos da Jessica?')) {
                    for (const prof of professionals) {
                        const { error } = await supabase
                            .from('professionals')
                            .delete()
                            .eq('id', prof.id);
                        
                        if (error) {
                            console.error(`❌ Erro ao deletar ${prof.name}:`, error);
                        } else {
                            console.log(`✅ Deletado: ${prof.name} (${prof.email})`);
                        }
                    }
                    alert('✅ Registros órfãos deletados! Jessica pode tentar se cadastrar novamente.');
                    location.reload();
                }
            };
            
            document.body.appendChild(deleteButton);
        } else {
            console.log('✅ Nenhum registro órfão encontrado na tabela professionals');
        }
        
    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

// Função para testar cadastro da Jessica
async function testJessicaSignup() {
    const testEmail = 'jessica@teste.com'; // Substitua pelo email real
    const testPassword = 'senha123456';
    
    console.log(`🧪 Testando cadastro da Jessica com: ${testEmail}`);
    
    try {
        // Primeiro fazer logout para limpar sessão
        await supabase.auth.signOut();
        
        // Tentar cadastro
        const { data, error } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    name: 'Jessica Teste',
                    phone: '11999999999',
                    specialty: 'Teste',
                    company: 'Teste',
                    project_id: 'herbalead'
                }
            }
        });
        
        if (error) {
            console.log('❌ Erro no cadastro:', error.message);
            
            // Analisar tipo de erro
            if (error.message.includes('User already registered')) {
                console.log('🚨 PROBLEMA: Usuário já registrado');
                console.log('💡 SOLUÇÃO: Verificar registros órfãos ou usar email diferente');
            } else if (error.message.includes('Invalid email')) {
                console.log('⚠️ Email inválido');
            } else {
                console.log('❓ Outro erro:', error.message);
            }
        } else {
            console.log('✅ Cadastro bem-sucedido:', data);
        }
        
    } catch (error) {
        console.error('❌ Erro inesperado:', error);
    }
}

// Executar debug
debugJessicaSignup();

console.log(`
🔧 COMANDOS DISPONÍVEIS:
- debugJessicaSignup() - Investigar registros da Jessica
- testJessicaSignup() - Testar cadastro da Jessica

📝 INSTRUÇÕES:
1. Substitua 'jessica@teste.com' pelo email real da Jessica
2. Execute debugJessicaSignup() primeiro
3. Se encontrar registros órfãos, clique no botão vermelho
4. Depois teste o cadastro novamente
`);
