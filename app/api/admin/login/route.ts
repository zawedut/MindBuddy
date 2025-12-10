import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // ค้นหา Admin ใน Database
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (admin && admin.password === password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}