import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Get all users and sort by score (descending) and time taken (ascending)
    const users = await User.find({})
      .sort({ score: -1, timeTaken: 1 })
      .select('name score timeTaken completed');

    // Calculate statistics
    const totalParticipants = users.length;
    const completedParticipants = users.filter(user => user.completed).length;
    const averageScore = users.reduce((acc, user) => acc + user.score, 0) / totalParticipants;
    const averageTime = users.reduce((acc, user) => acc + user.timeTaken, 0) / totalParticipants;

    return NextResponse.json({
      results: users,
      stats: {
        totalParticipants,
        completedParticipants,
        averageScore,
        averageTime,
      },
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
} 