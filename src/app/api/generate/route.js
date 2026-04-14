import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { jobDescription, type } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Please set GEMINI_API_KEY in your .env.local file' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const basePrompt = `
      You are writing a ${type === 'email' ? 'cold email' : 'short cover letter'} on behalf of Komal Sharma, a React.js developer with 2.4 years of experience.
      Komal's background: 
      - Worked at avua.com (AI hiring platform) building production features like a real-time CV editor and recruiter dashboards using React, Node.js, MongoDB.
      - Recently built a full-stack expense tracker from scratch to deepen Typescript/MERN knowledge.
      
      Below is the job description for the role she wants to apply for.
      
      Job Description:
      ${jobDescription}
      
      Instructions:
      - Make the ${type === 'email' ? 'email' : 'cover letter'} highly personalized to the company and their requirements in the JD.
      - Frame Komal's experience specifically as a direct solution to what they are asking for.
      - Keep it concise, aggressive but polite, and under 200 words. Do not use generic buzzwords.
      - Start directly with the email/letter body. Don't output any introductory text explaining your actions.
    `;

    const result = await model.generateContent(basePrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
