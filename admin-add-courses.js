// Script para adicionar cursos via área administrativa
// Cole este código no console do navegador na página admin

async function addCourses() {
  try {
    // 1. Adicionar curso principal
    const courseResponse = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Treinamento Herbalead',
        description: 'Curso completo para dominar a plataforma Herbalead',
        difficulty_level: 'beginner',
        estimated_hours: 2,
        is_active: true
      })
    });

    if (!courseResponse.ok) {
      throw new Error('Erro ao criar curso');
    }

    const course = await courseResponse.json();
    console.log('Curso criado:', course);

    // 2. Adicionar módulos
    const modules = [
      {
        course_id: course.id,
        title: 'Como Começar',
        description: 'Guia completo para iniciar na plataforma',
        duration: '15 min',
        order_index: 1,
        is_active: true,
        pdf_materials: 'Aprenda os 10 passos essenciais para começar a usar o Herbalead'
      },
      {
        course_id: course.id,
        title: 'Como Criar Links',
        description: 'Tutorial para criar links personalizados',
        duration: '20 min',
        order_index: 2,
        is_active: true,
        pdf_materials: 'Domine a criação de links personalizados e calculadoras'
      },
      {
        course_id: course.id,
        title: 'Como Fazer Quiz',
        description: 'Guia para criar quizzes que convertem',
        duration: '25 min',
        order_index: 3,
        is_active: true,
        pdf_materials: 'Aprenda a criar quizzes eficazes que identificam perfis'
      }
    ];

    for (const module of modules) {
      const moduleResponse = await fetch('/api/course-modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(module)
      });

      if (!moduleResponse.ok) {
        throw new Error('Erro ao criar módulo');
      }

      const createdModule = await moduleResponse.json();
      console.log('Módulo criado:', createdModule);
    }

    console.log('✅ Todos os cursos e módulos foram criados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Executar
addCourses();
