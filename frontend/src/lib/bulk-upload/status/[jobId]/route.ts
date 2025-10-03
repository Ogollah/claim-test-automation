import { API_BASE_URL } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { jobId: string } }
) {
    try {
        const jobId = params.jobId;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/bulk/status/${jobId}`
        );

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching job status:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}