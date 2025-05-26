import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  const start = Date.now();
  try {
    await connectDB();
    console.log('DB connect time:', Date.now() - start, 'ms');

    const { name, ldap, mobileNumber } = await request.json();
    console.log('Request parse time:', Date.now() - start, 'ms');

    // Check if user already exists
    const existingUser = await User.findOne({ ldap });
    console.log('User findOne time:', Date.now() - start, 'ms');
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this LDAP ID already exists' },
        { status: 400 }
      );
    }

    // Create new user and await the result
    const user = await User.create({ name, ldap, mobileNumber });
    console.log('User created:', user._id, 'Total time:', Date.now() - start, 'ms');
    return NextResponse.json({ userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 