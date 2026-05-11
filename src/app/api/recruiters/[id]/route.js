import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recruiter from '@/models/Recruiter';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const { id } = await params;
    await Recruiter.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
