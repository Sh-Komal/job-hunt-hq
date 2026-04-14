import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Progress from '@/models/Progress';

export async function GET() {
  try {
    await connectDB();
    let progress = await Progress.findOne({ userId: 'komal' });
    if (!progress) {
      progress = await Progress.create({ userId: 'komal', dsaDone: {}, prepDone: {} });
    }
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const progress = await Progress.findOneAndUpdate(
      { userId: 'komal' },
      { $set: body },
      { new: true, upsert: true }
    );
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
