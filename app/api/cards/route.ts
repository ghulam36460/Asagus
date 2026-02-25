import { NextRequest, NextResponse } from 'next/server'
import { staticCards, type CardEntry } from '@/data/cards'

// In-memory store (replace with DB calls when needed)
let store: CardEntry[] = [...staticCards]

// ── GET /api/cards ──────────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({ success: true, data: store })
}

// ── POST /api/cards ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, imageUrl, category, tech, link } = body

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'title and description are required' },
        { status: 400 },
      )
    }

    const newCard: CardEntry = {
      id: String(store.length + 1).padStart(2, '0'),
      title,
      description,
      imageUrl: imageUrl ?? null,
      category: category ?? '',
      tech: Array.isArray(tech) ? tech : [],
      link: link ?? undefined,
      createdAt: new Date().toISOString(),
    }

    store.push(newCard)
    return NextResponse.json({ success: true, data: newCard }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }
}
