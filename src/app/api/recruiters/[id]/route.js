import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recruiter from '@/models/Recruiter';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Recruiter.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
