import { NextRequest, NextResponse } from 'next/server'

// Placeholder: Quiz duplication endpoint (to be implemented in Phase 3)
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	return NextResponse.json(
		{ error: 'Not implemented yet', message: `Duplication for quiz ${id} will be added in Phase 3.` },
		{ status: 501 }
	)
}

