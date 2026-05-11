import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import Recruiter from '@/models/Recruiter';

// ONE-TIME migration: tag all existing data with Komal's email
// Run once via: GET /api/migrate?secret=jobhunt-migrate-2024
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'jobhunt-migrate-2024') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
  }

  const KOMAL_EMAIL = 'ikomalsharma27@gmail.com';

  try {
    await connectDB();

    // Tag all jobs that don't have a userId yet
    const jobResult = await Job.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: KOMAL_EMAIL } }
    );

    // Also tag jobs that have null or empty userId
    const jobResult2 = await Job.updateMany(
      { userId: { $in: [null, ''] } },
      { $set: { userId: KOMAL_EMAIL } }
    );

    const recruiterResult = await Recruiter.updateMany(
      { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: '' }] },
      { $set: { userId: KOMAL_EMAIL } }
    );

    return NextResponse.json({
      success: true,
      message: `All existing data tagged to ${KOMAL_EMAIL}`,
      results: {
        jobs: jobResult.modifiedCount + jobResult2.modifiedCount,
        recruiters: recruiterResult.modifiedCount,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
