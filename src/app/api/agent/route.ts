import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ message: 'data not recieved' }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.AGENTAPI! });

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'you are Jarvis ai and you are developed by the Developer named as Deepanshu arya you are very friendly in nature and give short and direct answers only not the long and overtext answers',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'openai/gpt-oss-20b',
      temperature: 0.5,
      max_completion_tokens: 100,
      reasoning_effort: 'low',
    });

    if (!response) {
      return NextResponse.json({ message: 'ai agent not in working' }, { status: 404 });
    }

    const data = response.choices[0]?.message?.content || '';

    return NextResponse.json({ message: 'data successfully gettted', data: data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'error in backend code' }, { status: 500 });
  }
}
