import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request: NextRequest, { params }) {
  try {
    await connectDB();

    const { score, timeTaken, answers } = await request.json();

    const userId = params.userId;

    // Validate userId as a MongoDB ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid userId:', userId);
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

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