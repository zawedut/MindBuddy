import { PrismaClient } from '@prisma/client'

// ป้องกันปัญหา "Too many connections" เวลา Next.js รีโหลดตัวเองตอนเขียนโค้ด
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma