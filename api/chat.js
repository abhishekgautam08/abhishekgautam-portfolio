import { retrieveRelevantContext, formatRAGContext } from './retriever.js';
import { connectToDatabase } from './lib/db.js';
import { extractVisitorMetadata } from './lib/geo.js';

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

// Helper to save messages to MongoDB asynchronously
async function saveMessageToDb({ sessionId, visitor, userMessage, assistantMessage }) {
  try {
    const { collections } = await connectToDatabase();
    const { conversations } = collections;

    const now = new Date();
    const messagesToPush = [];
    if (userMessage) {
      messagesToPush.push({
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        role: 'user',
        content: userMessage,
        timestamp: now
      });
    }
    if (assistantMessage) {
      messagesToPush.push({
        id: 'msg_' + (Date.now() + 1) + '_' + Math.random().toString(36).substr(2, 4),
        role: 'assistant',
        content: assistantMessage.content,
        sources: assistantMessage.sources || [],
        timestamp: new Date()
      });
    }

    if (messagesToPush.length === 0) return;

    await conversations.updateOne(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          firstActive: now,
        },
        $set: {
          visitor,
          lastActive: new Date()
        },
        $push: {
          messages: { $each: messagesToPush }
        },
        $inc: {
          messageCount: messagesToPush.length
        }
      },
      { upsert: true }
    );
  } catch (err) {
    console.error('[DB] Failed to persist chat log to MongoDB:', err.message);
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
    const {
      messages,
      stream = false,
      sessionId: clientSessionId,
      clientInfo = {}
    } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return send(res, 400, { error: 'messages array required' });
    }

    const sessionId = clientSessionId || 'anon_' + Date.now();
    const visitor = extractVisitorMetadata(req, clientInfo);

    // Extract the latest user query
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const userQuery = lastUserMessage ? lastUserMessage.content : '';

    // Fast Guardrails: Prevent misuse as a generic coding assistant, homework solver, or general AI tool
    const isGenericCodingRequest =
      /\b(write|give|provide|show|generate|create|send|build)\b.*\b(code|script|snippet|function|program|query|regex|solution|tutorial|boilerplate|page|app)\b/i.test(userQuery)
      || /\bhow\s+(to|can\s+i|do\s+i)\s+(connect|write|build|create|code|implement|install|setup|fix|debug|use)\b/i.test(userQuery)
      || /\b(connect|integration)\s+\w+\s+(to|with)\s+\w+\b.*\b(code|example|steps)?\b/i.test(userQuery)
      || /\b(solve|debug|fix)\s+(this|my)\b/i.test(userQuery);

    const isAskingAboutAbhishekSpecifically = /\b(abhishek|your experience|your project|your work|how did you|what did you|tell me about your|why did you|your architecture|your role|your stack)\b/i.test(userQuery);

    const isGeneralOffTopic = /weather|recipe|poem|joke|solve this math|who won the match|write a song|ignore previous instructions|world cup|capital of|tell me a story|lyrics|president/i.test(userQuery);

    if ((isGenericCodingRequest || isGeneralOffTopic) && !isAskingAboutAbhishekSpecifically) {
      const refusalMsg = "I am Abhishek Gautam's personal AI representative, not a general-purpose coding assistant. I cannot write code snippets, tutorials, or scripts for external work. I'm here specifically to answer questions about Abhishek's engineering background, architectural designs, work history, and portfolio projects. Feel free to ask about his work or reach out at gautamabhishek0810@gmail.com!";
      
      // Save query and refusal to DB
      await saveMessageToDb({
        sessionId,
        visitor,
        userMessage: userQuery,
        assistantMessage: { content: refusalMsg, sources: ['Guardrails Refusal'] }
      });

      if (stream) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        });
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: refusalMsg } }] })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
      return send(res, 200, {
        reply: refusalMsg,
        sources: []
      });
    }

    // Retrieve relevant context using RAG
    const relevantChunks = retrieveRelevantContext(userQuery, 4);
    const ragContext = formatRAGContext(relevantChunks);
    const sourceTitles = relevantChunks.map(c => c.title);

    const systemPrompt = `You are Abhishek Gautam's personal AI representative on his portfolio website.
Your objective is to give recruiters, engineering managers, and visitors comprehensive, accurate, and professional answers about Abhishek's career, technical skills, projects, and achievements.

### CRITICAL RULES:
- STRICT NO-CODE FOR EXTERNAL WORK: You must NEVER write generic code snippets, functions, tutorials, or scripts for visitors (e.g. connecting MongoDB to Node.js, sorting algorithms, building login forms, or debugging their personal code). You are strictly Abhishek Gautam's portfolio representative, NOT a general-purpose coding bot. If asked to write code for external tasks, refuse politely and explain that you can discuss how Abhishek designed his systems, but cannot write code for external projects.
- TARGET LENGTH: Provide thorough yet focused answers of around 5 to 7 lines (approx. 100 to 150 words). Avoid answers that are too brief (1-2 lines) or excessively long essays.
- EXPLAIN TECHNICAL DEPTH: When answering technical questions (e.g. Vite micro-frontends, multi-tenant MongoDB, AWS audits), explain the architectural design, patterns used, and measurable results. Do not write raw code blocks.
- SCOPE RESTRICTION: You represent ONLY Abhishek Gautam. For any out-of-scope, unrelated, or random questions (such as cooking, math, trivia, or general AI tasks), politely state in 1-2 lines that you only answer questions about Abhishek Gautam's career and projects.
- Speak directly in first person ("I") or professional third person ("Abhishek").
- Base answers strictly on the verified background information provided in the context below.
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
          max_tokens: 350,
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const fallbackMsg = "I'm temporarily having trouble reaching the AI service. Abhishek is a Full Stack Developer (MERN, AWS, Micro-frontends) with 3.5+ years of experience. Feel free to contact him directly at gautamabhishek0810@gmail.com or via LinkedIn!";
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: fallbackMsg } }] })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();

        saveMessageToDb({
          sessionId,
          visitor,
          userMessage: userQuery,
          assistantMessage: { content: fallbackMsg, sources: ['Fallback'] }
        });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAssistantReply = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        res.write(chunk);

        // Parse chunks to accumulate reply for MongoDB storage
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.slice(6));
              const delta = parsed.choices?.[0]?.delta?.content || '';
              fullAssistantReply += delta;
            } catch {
              // ignore partial line parsing
            }
          }
        }
      }
      res.end();

      // Persist completed conversation stream to MongoDB in background
      saveMessageToDb({
        sessionId,
        visitor,
        userMessage: userQuery,
        assistantMessage: { content: fullAssistantReply, sources: sourceTitles }
      });
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
        max_tokens: 350,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const fallbackReply = "I'm temporarily having trouble reaching the AI server. Abhishek is a Full Stack Developer (MERN, AWS, Micro-frontends) with 3.5+ years of experience. Feel free to contact him directly at gautamabhishek0810@gmail.com or via LinkedIn!";
      
      saveMessageToDb({
        sessionId,
        visitor,
        userMessage: userQuery,
        assistantMessage: { content: fallbackReply, sources: ['Quick Summary'] }
      });

      return send(res, 200, {
        reply: fallbackReply,
        sources: ['Quick Summary']
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Abhishek Gautam is a Full Stack Developer (MERN & AWS). For any queries, reach him directly at gautamabhishek0810@gmail.com.';

    // Save to MongoDB
    saveMessageToDb({
      sessionId,
      visitor,
      userMessage: userQuery,
      assistantMessage: { content: reply, sources: sourceTitles }
    });

    return send(res, 200, {
      reply,
      sources: sourceTitles,
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return send(res, 200, {
      reply: "I'm having temporary connection trouble. Abhishek is a Full Stack Developer (MERN, AWS, Micro-frontends). You can reach him directly at gautamabhishek0810@gmail.com or on LinkedIn!",
      sources: ['Contact Info']
    });
  }
}
