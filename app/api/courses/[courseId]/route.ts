import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Get program info
    const { data: program } = await supabase
      .from('programs')
      .select('*')
      .eq('id', course.program_id)
      .single();

    // Get lessons count
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id', { count: 'exact' })
      .eq('course_id', courseId);

    return NextResponse.json({
      ...course,
      program,
      lessonCount: lessons?.length || 0,
    });
  } catch (error) {
    console.error('Course detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
