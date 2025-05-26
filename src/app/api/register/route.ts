import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, ldap, mobileNumber } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ ldap });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this LDAP ID already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      ldap,
      mobileNumber,
    });

    return NextResponse.json({ userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 