import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const job = await Job.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Job.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
