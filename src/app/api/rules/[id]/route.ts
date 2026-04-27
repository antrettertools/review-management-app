import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const allowed = ['is_active', 'name', 'response_template', 'use_ai', 'tone', 'condition_type', 'condition_value']
  const updates: Record<string, any> = {}

  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  // Remap camelCase from client
  if ('responseTemplate' in body) updates.response_template = body.responseTemplate
  if ('useAi' in body) updates.use_ai = body.useAi
  if ('conditionType' in body) updates.condition_type = body.conditionType
  if ('conditionValue' in body) updates.condition_value = body.conditionValue
  if ('isActive' in body) updates.is_active = body.isActive

  const { data, error } = await supabase
    .from('auto_response_rules')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await supabase
    .from('auto_response_rules')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
