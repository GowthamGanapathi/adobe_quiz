import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET() {
  try {
    await connectDB();

    // Get all questions and randomly select 15
    const allQuestions = await Question.find({});
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 15);

    // Remove correct answers from the response
    const questions = selectedQuestions.map(({ _id, question, options }) => ({
      _id,
      question,
      options,
    }));

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
} 