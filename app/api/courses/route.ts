import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const programId = searchParams.get('programId');
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    let query = supabase
      .from('courses')
      .select('*')
      .order('title', { ascending: true });

    if (programId) {
      query = query.eq('program_id', programId);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Client-side filtering for search
    let filtered = data || [];
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Courses API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
