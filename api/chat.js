import {
  personalInfo,
  skills,
  projects,
  experience,
  education,
  certifications,
  services,
} from '../src/data/portfolioData.js';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'meta/llama-3.3-70b-instruct';

// MCP-style tool definitions (OpenAI function-calling format)
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_about',
      description: "Retrieve Abhishek Gautam's personal bio, professional summary, location, availability, and social links.",
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_skills',
      description: "Retrieve Abhishek's technical skills, optionally filtered by category.",
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['frontend', 'backend', 'database', 'cloud', 'ai', 'security', 'tools'],
            description: 'Skill category to filter by (omit for all)',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_projects',
      description: "Retrieve Abhishek's portfolio projects, optionally filtered by category.",
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['Fintech', 'Healthtech', 'AI', 'Architecture'],
            description: 'Project category to filter by (omit for all)',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_experience',
      description: "Retrieve Abhishek's work experience, education, and certifications.",
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_contact',
      description: "Retrieve Abhishek's contact information and professional links.",
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_services',
      description: 'Retrieve the professional services Abhishek offers.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
];

// RAG retrieval — execute a tool call and return structured context
function executeTool(name, input) {
  switch (name) {
    case 'get_about':
      return { personalInfo };
    case 'get_skills':
      if (input.category) return { [input.category]: skills[input.category] };
      return { skills };
    case 'get_projects': {
      const list = input.category
        ? projects.filter((p) => p.category === input.category)
        : projects;
      return {
        projects: list.map(({ id, title, description, tech, features, category }) => ({
          id, title, description, tech, features, category,
        })),
      };
    }
    case 'get_experience':
      return {
        experience: experience.map(({ role, company, period, type, description, achievements, tech }) => ({
          role, company, period, type, description, achievements, tech,
        })),
        education,
        certifications,
      };
    case 'get_contact':
      return {
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        github: personalInfo.github,
        linkedin: personalInfo.linkedin,
        availability: personalInfo.availability,
      };
    case 'get_services':
      return { services: services.map(({ title, description, features }) => ({ title, description, features })) };
    default:
      return { error: 'Unknown tool' };
  }
}

// Plain Node.js response helper — works in Vercel, Connect, and Vite dev middleware
function send(res, status, data) {
  res.statusCode = status;
  if (data !== undefined) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
}

const SYSTEM_PROMPT = `You are Abhishek Gautam's personal AI assistant on his portfolio website.

Your ONLY purpose is to answer questions about Abhishek — his professional background, technical skills, projects, work experience, services, and contact information.

Rules:
- Always use the available tools to retrieve accurate information before answering.
- If a question is unrelated to Abhishek's professional profile, politely say: "I can only answer questions about Abhishek's professional background. Feel free to ask about his skills, projects, or experience!"
- Keep responses concise, friendly, and professional.
- Format key information as clear bullet points when listing multiple items.
- Never make up information — only use what the tools return.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return send(res, 200);
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return send(res, 500, { error: 'NVIDIA_API_KEY not configured' });

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return send(res, 400, { error: 'messages array required' });
    }

    const currentMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(({ role, content }) => ({ role, content })),
    ];

    // Agentic loop
    for (let step = 0; step < 5; step++) {
      const response = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: currentMessages,
          tools,
          tool_choice: 'auto',
          max_tokens: 1024,
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('NVIDIA API error:', err);
        return send(res, 502, { error: 'AI service error. Please try again.' });
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      if (!choice) return send(res, 502, { error: 'Empty response from AI.' });

      const { message, finish_reason } = choice;

      // Final answer — no tool calls
      if (finish_reason === 'stop' || !message.tool_calls?.length) {
        return send(res, 200, { reply: message.content || 'I could not generate a response.' });
      }

      // Process tool calls
      currentMessages.push({ role: 'assistant', content: message.content ?? null, tool_calls: message.tool_calls });

      for (const toolCall of message.tool_calls) {
        let input = {};
        try { input = JSON.parse(toolCall.function.arguments || '{}'); } catch { /* ignore */ }
        const result = executeTool(toolCall.function.name, input);
        currentMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    return send(res, 500, { error: 'Agent loop exceeded. Please try again.' });
  } catch (err) {
    console.error('Chat API error:', err);
    return send(res, 500, { error: 'Something went wrong. Please try again.' });
  }
}
