import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recording from '@/models/Recording';

export async function GET() {
  try {
    await connectDB();
    // Return all recordings but exclude heavy audioData for the list view
    const recordings = await Recording.find().sort({ createdAt: -1 }).select('-audioData');
    return NextResponse.json(recordings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const recording = await Recording.create(body);
    return NextResponse.json(recording, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
