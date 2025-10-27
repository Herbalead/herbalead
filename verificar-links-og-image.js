const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function verificarLinks() {
  console.log('🔍 Verificando links e suas imagens OG...\n')
  
  try {
    // Buscar alguns links
    const { data: links, error } = await supabase
      .from('links')
      .select('id, name, tool_name, og_image')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('❌ Erro:', error)
      return
    }
    
    console.log(`📋 Total de links encontrados: ${links.length}\n`)
    
    links.forEach((link, index) => {
      console.log(`${index + 1}. ${link.name}`)
      console.log(`   Ferramenta: ${link.tool_name || 'N/A'}`)
      console.log(`   Imagem OG: ${link.og_image || '❌ NÃO DEFINIDA'}`)
      console.log('')
    })
    
    // Verificar quantos não têm imagem
    const linksSemImagem = links.filter(l => !l.og_image || l.og_image === '')
    console.log(`\n⚠️  Links sem imagem: ${linksSemImagem.length}`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

verificarLinks()

