import { retrieveRelevantContext, formatRAGContext } from './retriever.js';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'meta/llama-3.2-11b-vision-instruct';

function send(res, status, data) {
  res.statusCode = status;
  if (data !== undefined) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return send(res, 200);
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return send(res, 500, { error: 'NVIDIA_API_KEY not configured' });

  try {
    const { messages, stream = false } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return send(res, 400, { error: 'messages array required' });
    }

    // Extract the latest user query
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const userQuery = lastUserMessage ? lastUserMessage.content : '';

    // Fast off-topic / prompt-injection check
    const isOffTopic = /weather|recipe|poem|joke|solve this math|who won the match|write a song|ignore previous instructions/i.test(userQuery);
    if (isOffTopic && !/abhishek|code|react|node|aws|work|experience|project/i.test(userQuery)) {
      return send(res, 200, {
        reply: "I am Abhishek Gautam's personal AI representative. I'm here to answer questions about his software engineering background, architectural designs, work history, skills, and portfolio projects. Feel free to ask about any of his work!",
        sources: []
      });
    }

    // Retrieve relevant context using RAG
    const relevantChunks = retrieveRelevantContext(userQuery, 4);
    const ragContext = formatRAGContext(relevantChunks);
    const sourceTitles = relevantChunks.map(c => c.title);

    const systemPrompt = `You are Abhishek Gautam's personal AI representative on his portfolio website.
Your objective is to give recruiters, engineering managers, and visitors brief, accurate, and professional answers about Abhishek's career, technical skills, projects, and achievements.

### CRITICAL RULES:
- STRICT LENGTH LIMIT: Give short answers only — maximum 4 to 5 lines total (about 40 to 70 words). Never write long explanations or lengthy lists.
- Speak directly in first person ("I") or professional third person ("Abhishek").
- Base answers strictly on the verified background information provided in the context below.
- Highlight key achievements or tools concisely (e.g., 20% AWS savings, multi-tenant MongoDB, Vite MFE).
- If a question is not covered in the context, concisely suggest contacting Abhishek directly via email (gautamabhishek0810@gmail.com) or LinkedIn.

### VERIFIED BACKGROUND CONTEXT:
${ragContext}`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-6).map(({ role, content }) => ({ role, content })),
    ];

    // Handle Streaming (SSE)
    if (stream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      const response = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: formattedMessages,
          stream: true,
          max_tokens: 160,
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('NVIDIA stream API error:', errText);
        res.write(`data: ${JSON.stringify({ error: 'AI service unavailable' })}\n\n`);
        res.end();
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        res.write(chunk);
      }
      res.end();
      return;
    }

    // Standard Non-Streaming JSON Response
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: formattedMessages,
        stream: false,
        max_tokens: 160,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('NVIDIA API error:', err);
      return send(res, 502, { error: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'I could not generate a response at this time.';

    return send(res, 200, {
      reply,
      sources: sourceTitles,
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return send(res, 500, { error: 'Something went wrong. Please try again.' });
  }
}
