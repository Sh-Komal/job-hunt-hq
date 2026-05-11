import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Progress from '@/models/Progress';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({ userId, dsaDone: {}, prepDone: {} });
    }
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = await getAuthUser();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await request.json();
    const progress = await Progress.findOneAndUpdate(
      { userId },
      { $set: body },
      { new: true, upsert: true }
    );
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
