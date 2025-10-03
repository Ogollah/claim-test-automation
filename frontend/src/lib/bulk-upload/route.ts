import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE_URL } from '../utils';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const isDev = formData.get('isDev') === 'true';
        const batchSize = formData.get('batchSize') || '1000';

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.includes('spreadsheet') && !file.name.endsWith('.xlsx')) {
            return NextResponse.json(
                { success: false, message: 'Invalid file type. Please upload an Excel file.' },
                { status: 400 }
            );
        }

        // Save file temporarily
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'uploads');
        const fileName = `bulk_${uuidv4()}_${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        // Forward to backend API
        const backendFormData = new FormData();
        backendFormData.append('file', new Blob([buffer]), file.name);
        backendFormData.append('isDev', isDev.toString());
        backendFormData.append('batchSize', batchSize.toString());

        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/claims/bundle/bulk/upload`, {
            method: 'POST',
            body: backendFormData,
        });

        const result = await backendResponse.json();

        return NextResponse.json(result);
    } catch (error) {
        console.error('Bulk upload error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}