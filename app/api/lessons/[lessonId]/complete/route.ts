import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const { userId } = await request.json();

    if (!lessonId || !userId) {
      return NextResponse.json(
        { error: 'lessonId and userId required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('lesson_completions')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // If it's a unique constraint error, they've already completed it
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Lesson already marked complete' },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Lesson completion API error:', error);
    return NextResponse.json(
      { error: 'Failed to mark lesson complete' },
      { status: 500 }
    );
  }
}
