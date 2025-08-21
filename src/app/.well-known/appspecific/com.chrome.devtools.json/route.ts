import { NextResponse } from 'next/server'

// Chrome DevTools néha lekéri ezt a fájlt lokális fejlesztéskor.
// Válaszoljunk 204-gyel, hogy ne legyen 404 a logban.
export async function GET() {
  return new NextResponse(null, { status: 204 })
}
