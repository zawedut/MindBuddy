import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Typhoon AI Client
const typhoon = new OpenAI({
    apiKey: process.env.TYPHOON_API_KEY || '',
    baseURL: 'https://api.opentyphoon.ai/v1',
});

export async function GET() {
    const results: any = {
        timestamp: new Date().toISOString(),
        tests: {}
    };

    // 1. ทดสอบ API Key
    results.tests.apiKey = {
        exists: !!process.env.TYPHOON_API_KEY,
        length: process.env.TYPHOON_API_KEY?.length || 0,
        prefix: process.env.TYPHOON_API_KEY?.substring(0, 10) + '...',
    };

    // 2. ทดสอบ Typhoon API
    try {
        const completion = await typhoon.chat.completions.create({
            model: 'typhoon-v2.5-30b-a3b-instruct',
            messages: [
                { role: 'user', content: 'สวัสดี ตอบสั้นๆ ว่า "ทดสอบสำเร็จ"' }
            ],
            max_tokens: 50,
        });

        results.tests.typhoonApi = {
            success: true,
            model: 'typhoon-v2.5-30b-a3b-instruct',
            response: completion.choices[0]?.message?.content,
        };
    } catch (error: any) {
        results.tests.typhoonApi = {
            success: false,
            model: 'typhoon-v2.5-30b-a3b-instruct',
            error: error.message,
            status: error.status,
            details: error.error || 'No details',
        };
    }

    // 3. ทดสอบ model อื่น (models ที่ยังใช้ได้จริงเท่านั้น)
    const modelsToTest: string[] = [];

    for (const model of modelsToTest) {
        try {
            const completion = await typhoon.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: 'test' }],
                max_tokens: 10,
            });
            results.tests[`model_${model}`] = { success: true };
        } catch (error: any) {
            results.tests[`model_${model}`] = {
                success: false,
                error: error.message,
                status: error.status
            };
        }
    }

    return NextResponse.json(results, { status: 200 });
}
