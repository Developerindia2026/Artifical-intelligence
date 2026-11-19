import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 86400 });

export async function POST(request: Request) {
  //cache storage

  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ message: 'data not recieved' }, { status: 400 });
    }

    // Invoking API
    const groq = new Groq({ apiKey: process.env.AGENTAPI! });
    const tvly = tavily({ apiKey: process.env.TAVILYAPI! });

    //get history from cache storage

    const history = cache.get<any[]>('jarvis') || [];

    console.log('OLD HISTORY:', history);

    // 1st call
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'you are Jarvis AI and you are developed and desgined by Deepanshu Arya',
        },
        ...history,
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

    let finalAnswer = '';

    if (data.tool_calls?.length) {
      const query = JSON.parse(data.tool_calls[0].function.arguments).query;

      const search = await tvly.search(query);

      // 2nd CALL

      const final = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `question is ${message} and the search result is ${search} now based on the question and answer, simplyfy the answer into the short and perfect understanding way and make sure it is easy to understand and correct`,
          },
          ...history,
        ],
        model: 'openai/gpt-oss-20b',
        reasoning_effort: 'low',
        max_completion_tokens: 100,
        temperature: 0.5,
      });

      finalAnswer = final.choices[0]?.message?.content || '';
    } else {
      finalAnswer = data.content || '';
    }

    //save conversation.....

    cache.set('jarvis', [
      ...history,
      {
        role: 'user',
        content: message,
      },
      {
        role: 'assistant',
        content: finalAnswer,
      },
    ]);

    console.log('SAVED HISTORY:', cache.get('jarvis'));

    return NextResponse.json(
      { message: 'data successfully gettted', data: finalAnswer },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'error in backend code' }, { status: 500 });
  }
}
