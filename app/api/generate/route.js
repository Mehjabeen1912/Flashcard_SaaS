import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
You are a flashcard creator. You take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return the flashcards in the following JSON format:
{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
    const openai = new OpenAI();
    const data = await req.text();
  
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: data },
        ],
        model: 'gpt-4o',  // Make sure to use the correct model as per your OpenAI plan
        response_format: { type: 'json_object' },
      });
  
      // Parse the JSON response from the OpenAI API
      const flashcards = JSON.parse(completion.choices[0].message.content);
  
      // Return the flashcards as a JSON response
      return NextResponse.json(flashcards.flashcards);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      return new NextResponse(JSON.stringify({ error: { message: error.message } }), { status: 500 });
    }
  }
  
