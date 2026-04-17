import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recording from '@/models/Recording';

// GET /api/recordings/[id] - fetch full recording with audio data for playback
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const recording = await Recording.findById(id);
    if (!recording) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(recording);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/recordings/[id] - rename
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { name, question } = await request.json();
    const updated = await Recording.findByIdAndUpdate(
      id,
      { ...(name && { name }), ...(question !== undefined && { question }) },
      { new: true }
    ).select('-audioData');
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/recordings/[id]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Recording.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

