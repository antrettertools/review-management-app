import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('businessId')
  if (!businessId) return NextResponse.json({ error: 'businessId required' }, { status: 400 })

  const { data, error } = await supabase
    .from('auto_response_rules')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { businessId, name, conditionType, conditionValue, responseTemplate, useAi, tone } = body

  if (!businessId || !name || !conditionType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!useAi && !responseTemplate?.trim()) {
    return NextResponse.json({ error: 'Must provide template or enable AI' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('auto_response_rules')
    .insert([{
      business_id: businessId,
      name,
      condition_type: conditionType,
      condition_value: conditionValue ?? null,
      response_template: useAi ? null : responseTemplate,
      use_ai: useAi ?? false,
      tone: tone ?? 'professional',
      is_active: true,
    }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
