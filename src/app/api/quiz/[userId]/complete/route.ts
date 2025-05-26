import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { score, timeTaken, answers } = await request.json();

    // Extract userId from the URL
    const url = new URL(request.url);
    const userId = url.pathname.split('/').filter(Boolean).pop();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        score,
        timeTaken,
        answers,
        completed: true,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing quiz:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz results' },
      { status: 500 }
    );
  }
} 