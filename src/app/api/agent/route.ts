import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ message: 'data not recieved' }, { status: 400 });
    }

    // Invoking API
    const groq = new Groq({ apiKey: process.env.AGENTAPI! });
    const tvly = tavily({ apiKey: process.env.TAVILYAPI! });

    // 1st call

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
      tools: [
        {
          type: 'function',
          function: {
            name: 'Latest_Search_Tool',
            description: 'Get latest information and real-time information on the internet',
            parameters: {
              // JSON Schema object
              type: 'object',
              properties: {
                query: { type: 'string' },
              },
              required: ['query'],
            },
          },
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
    const data = response.choices[0]?.message || '';

    if (data.tool_calls?.length) {
      const query = await data.tool_calls[0].function.arguments;

      const search = await tvly.search(query);

      // 2nd CALL

      const final = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `question is ${message} and the search result is ${search} now based on the question and answer, simplyfy the answer into the short and perfect understanding way and make sure it is easy to understand and correct`,
          },
        ],
        model: 'openai/gpt-oss-20b',
        reasoning_effort: 'low',
        max_completion_tokens: 100,
        temperature: 0.5,
      });

      const finalAnswer = final.choices[0]?.message?.content || '';

      return NextResponse.json(
        { message: 'tool kit successfully answerd', data: finalAnswer },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'data successfully gettted', data: data.content },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'error in backend code' }, { status: 500 });
  }
}
