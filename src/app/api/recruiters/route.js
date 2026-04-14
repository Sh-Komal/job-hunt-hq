import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recruiter from '@/models/Recruiter';

export async function GET() {
  try {
    await connectDB();
    const recruiters = await Recruiter.find().sort({ createdAt: -1 });
    return NextResponse.json(recruiters);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const recruiter = await Recruiter.create(body);
    return NextResponse.json(recruiter, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
