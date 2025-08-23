import { NextResponse } from 'next/server'

// Chrome DevTools néha lekéri ezt a fájlt lokális fejlesztéskor.
// Válaszoljunk 204-gyel, hogy ne legyen 404 a logban.

// For static export, make this static
export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  return new NextResponse(null, { status: 204 })
}
