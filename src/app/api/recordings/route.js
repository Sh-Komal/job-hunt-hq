import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recording from '@/models/Recording';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const recordings = await Recording.find({ userId }).sort({ createdAt: -1 }).select('-audioData');
    return NextResponse.json(recordings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await request.json();
    const recording = await Recording.create({ ...body, userId });
    return NextResponse.json(recording, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
