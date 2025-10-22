import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📚 Criando curso:', body)
    
    // Validar dados obrigatórios
    if (!body.title || !body.description) {
      return NextResponse.json({ 
        error: 'Dados obrigatórios: title, description' 
      }, { status: 400 })
    }

    // Preparar dados do curso
    const courseData = {
      title: body.title,
      description: body.description,
      modules: body.modules || [],
      is_active: body.is_active !== undefined ? body.is_active : true,
      enrollment_required: body.enrollment_required !== undefined ? body.enrollment_required : true,
      max_enrollments: body.max_enrollments || null,
      course_image_url: body.course_image_url || null,
      difficulty_level: body.difficulty_level || 'beginner',
      estimated_hours: body.estimated_hours || 0,
      prerequisites: body.prerequisites || [],
      learning_objectives: body.learning_objectives || [],
      course_tags: body.course_tags || []
    }

    // Inserir curso no banco
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar curso:', error)
      return NextResponse.json({ 
        error: 'Erro ao criar curso',
        details: error.message 
      }, { status: 500 })
    }

    console.log('✅ Curso criado com sucesso:', data)
    
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
    const activeOnly = searchParams.get('active_only') === 'true'

    let query = supabase
      .from('courses')
      .select(`
        *,
        course_modules!inner(
          id,
          title,
          description,
          duration,
          order_index,
          is_active
        )
      `)
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar cursos:', error)
      return NextResponse.json({ 
        error: 'Erro ao buscar cursos',
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
