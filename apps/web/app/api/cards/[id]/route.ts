import { NextRequest, NextResponse } from 'next/server'
import { staticCards, type CardEntry } from '@/data/cards'

// Shared in-memory store (same reference as route.ts — reset-safe for demo)
// In production, replace with DB queries.
let store: CardEntry[] = [...staticCards]

type Params = { params: Promise<{ id: string }> }

// ── PUT /api/cards/:id ───────────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  const idx = store.findIndex((c) => c.id === id)

  if (idx === -1) {
    return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    store[idx] = { ...store[idx], ...body, id } // id is immutable
    return NextResponse.json({ success: true, data: store[idx] })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }
}

// ── DELETE /api/cards/:id ────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const idx = store.findIndex((c) => c.id === id)

  if (idx === -1) {
    return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 })
  }

  const deleted = store.splice(idx, 1)[0]
  return NextResponse.json({ success: true, data: deleted })
}
