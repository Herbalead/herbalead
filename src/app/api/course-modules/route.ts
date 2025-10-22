import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📝 Criando módulo de curso:', body)
    
    // Validar dados obrigatórios
    if (!body.course_id || !body.title || !body.description || !body.duration) {
      return NextResponse.json({ 
        error: 'Dados obrigatórios: course_id, title, description, duration' 
      }, { status: 400 })
    }

    // Preparar dados do módulo
    const moduleData = {
      course_id: body.course_id,
      title: body.title,
      description: body.description,
      duration: body.duration,
      video_url: body.video_url || null,
      pdf_materials: body.pdf_materials || null,
      pdf_files: body.pdf_files || null,
      order_index: body.order_index || 1,
      is_active: body.is_active !== undefined ? body.is_active : true
    }

    // Inserir módulo no banco
    const { data, error } = await supabase
      .from('course_modules')
      .insert(moduleData)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar módulo:', error)
      return NextResponse.json({ 
        error: 'Erro ao criar módulo',
        details: error.message 
      }, { status: 500 })
    }

    console.log('✅ Módulo criado com sucesso:', data)
    
    return NextResponse.json({ 
      success: true, 
      data 
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📝 Atualizando módulo de curso:', body)
    
    // Validar dados obrigatórios
    if (!body.id) {
      return NextResponse.json({ 
        error: 'ID do módulo é obrigatório' 
      }, { status: 400 })
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {}
    
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.duration !== undefined) updateData.duration = body.duration
    if (body.video_url !== undefined) updateData.video_url = body.video_url
    if (body.pdf_materials !== undefined) updateData.pdf_materials = body.pdf_materials
    if (body.pdf_files !== undefined) updateData.pdf_files = body.pdf_files
    if (body.order_index !== undefined) updateData.order_index = body.order_index
    if (body.is_active !== undefined) updateData.is_active = body.is_active
    
    updateData.updated_at = new Date().toISOString()

    // Atualizar módulo no banco
    const { data, error } = await supabase
      .from('course_modules')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar módulo:', error)
      return NextResponse.json({ 
        error: 'Erro ao atualizar módulo',
        details: error.message 
      }, { status: 500 })
    }

    console.log('✅ Módulo atualizado com sucesso:', data)
    
    return NextResponse.json({ 
      success: true, 
      data 
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')

    let query = supabase
      .from('course_modules')
      .select(`
        *,
        courses!inner(
          id,
          title
        )
      `)
      .order('order_index', { ascending: true })

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar módulos:', error)
      return NextResponse.json({ 
        error: 'Erro ao buscar módulos',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data 
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
