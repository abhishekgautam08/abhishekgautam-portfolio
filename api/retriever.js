import { knowledgeChunks } from '../src/data/knowledgeData.js';

// Common English stopwords to ignore in scoring
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'what', 'who', 'how', 'when', 'where', 'which', 'did', 'does',
  'do', 'can', 'could', 'would', 'should', 'about', 'me', 'tell', 'abhishek', 'gautam'
]);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOPWORDS.has(w));
}

export function retrieveRelevantContext(query, topK = 4) {
  if (!query || typeof query !== 'string') {
    return knowledgeChunks.slice(0, 3);
  }

  const queryLower = query.toLowerCase();
  const queryTokens = tokenize(queryLower);

  // If query is broad like "tell me about yourself" or "who are you"
  const isBroadIntro = /who are you|about yourself|introduce|overview|tell me about abhishek|summary/i.test(queryLower);
  if (isBroadIntro) {
    const defaultIds = ['bio-summary', 'skills-overview', 'exp-vivasvat-overview', 'exp-vigorus-overview'];
    return knowledgeChunks.filter(c => defaultIds.includes(c.id));
  }

  const scoredChunks = knowledgeChunks.map(chunk => {
    let score = 0;
    const chunkTitle = chunk.title.toLowerCase();
    const chunkContent = chunk.content.toLowerCase();
    const chunkTopics = chunk.topics.map(t => t.toLowerCase());

    // 1. Exact phrase match
    if (queryTokens.length >= 2 && chunkContent.includes(queryLower)) {
      score += 25;
    }

    // 2. Token scoring
    for (const token of queryTokens) {
      // Title match
      if (chunkTitle.includes(token)) {
        score += 8;
      }
      // Topic match
      if (chunkTopics.some(t => t.includes(token) || token.includes(t))) {
        score += 6;
      }
      // Content frequency
      let index = 0;
      let count = 0;
      while ((index = chunkContent.indexOf(token, index)) !== -1 && count < 6) {
        count++;
        score += 1.5;
        index += token.length;
      }
    }

    // 3. Technical keywords boost
    if (/mongo|multi-tenant|tenant|schema|index/i.test(queryLower) && chunk.id === 'exp-vivasvat-multitenant') {
      score += 20;
    }
    if (/vite|federation|micro-frontend|remote|module/i.test(queryLower) && chunk.id === 'exp-vivasvat-microfrontends') {
      score += 20;
    }
    if (/cost|audit|save|saving|ec2|cold start/i.test(queryLower) && chunk.id === 'exp-vivasvat-aws-devops') {
      score += 20;
    }
    if (/kyc|singzy|aadhaar|pan|e-sign|signature|kms/i.test(queryLower) && chunk.id === 'exp-vivasvat-security-kyc') {
      score += 20;
    }
    if (/chikitsa|vigorus|health|patient|doctor|iot|fabric/i.test(queryLower) && (chunk.id === 'exp-vigorus-achievements' || chunk.id === 'exp-vigorus-overview')) {
      score += 20;
    }
    if (/puppeteer|pdf|whatsapp/i.test(queryLower) && chunk.id === 'exp-vigorus-achievements') {
      score += 20;
    }
    if (/certificate|certifications|degree|college|poornima|btech|udemy|namaste/i.test(queryLower) && chunk.id === 'certifications-education') {
      score += 25;
    }
    if (/skill|tech stack|frontend|backend|cloud|database|languages/i.test(queryLower) && chunk.id === 'skills-overview') {
      score += 15;
    }

    return { chunk, score };
  });

  scoredChunks.sort((a, b) => b.score - a.score);

  // Return topK chunks that have positive relevance score
  const results = scoredChunks
    .filter(item => item.score > 0)
    .slice(0, topK)
    .map(item => item.chunk);

  // Fallback to bio if no specific matches found
  if (results.length === 0) {
    return [knowledgeChunks[0], knowledgeChunks[1]];
  }

  return results;
}

export function formatRAGContext(chunks) {
  return chunks
    .map((c, i) => `### Context [${i + 1}]: ${c.title}\n${c.content}`)
    .join('\n\n');
}
