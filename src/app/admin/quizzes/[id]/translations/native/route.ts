import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// For static export, skip this route
export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  // Return empty array to skip this route in static export
  return []
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Read the HTML file and inject quiz ID
    const htmlPath = join(process.cwd(), 'src/app/admin/quizzes/[id]/translations/edit-native.html')
    let html = readFileSync(htmlPath, 'utf-8')
    
    // Replace placeholder with actual quiz ID
    html = html.replace(/const quizId = .+;/, `const quizId = '${id}';`)
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error serving native editor:', error)
    return NextResponse.json({ error: 'Failed to load native editor' }, { status: 500 })
  }
}
