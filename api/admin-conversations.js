import { connectToDatabase } from './lib/db.js';
import { verifyToken, extractBearerToken } from './lib/auth.js';

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function parseQueryParams(url) {
  const query = {};
  if (!url || !url.includes('?')) return query;
  const queryString = url.split('?')[1];
  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) query[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  return query;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Check Admin Authorization
  const token = extractBearerToken(req);
  if (!token) {
    return send(res, 401, { error: 'Authentication required. Please log in.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return send(res, 401, { error: 'Invalid or expired session. Please log in again.' });
  }

  const queryParams = parseQueryParams(req.url);
  const { collections } = await connectToDatabase();
  const { conversations } = collections;

  // 1. GET requests
  if (req.method === 'GET') {
    // Single Conversation Detail
    if (queryParams.sessionId) {
      const conv = await conversations.findOne({ sessionId: queryParams.sessionId });
      if (!conv) {
        return send(res, 404, { error: 'Conversation not found' });
      }
      return send(res, 200, { conversation: conv });
    }

    // Analytics / Stats endpoint
    if (queryParams.stats === 'true') {
      const allConvs = await conversations.find({}).toArray();
      let totalQueries = 0;
      const countryCounts = {};
      const cityCounts = {};
      let totalMessages = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let activeToday = 0;

      allConvs.forEach(conv => {
        const msgs = conv.messages || [];
        totalMessages += msgs.length;
        totalQueries += msgs.filter(m => m.role === 'user').length;

        const country = conv.visitor?.country || 'Unknown';
        countryCounts[country] = (countryCounts[country] || 0) + 1;

        const city = conv.visitor?.city || 'Unknown';
        if (city !== 'Unknown') {
          cityCounts[`${city}, ${country}`] = (cityCounts[`${city}, ${country}`] || 0) + 1;
        }

        if (conv.lastActive && new Date(conv.lastActive) >= today) {
          activeToday++;
        }
      });

      const topCountries = Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      const topCities = Object.entries(cityCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      return send(res, 200, {
        stats: {
          totalConversations: allConvs.length,
          totalQueries,
          totalMessages,
          activeToday,
          topCountries,
          topCities
        }
      });
    }

    // List Conversations with Search & Pagination
    const limit = parseInt(queryParams.limit || '50', 10);
    const skip = parseInt(queryParams.skip || '0', 10);
    const search = (queryParams.search || '').trim().toLowerCase();

    const allConvs = await conversations.find({}).sort({ lastActive: -1 }).toArray();

    // Filter by search term if provided
    let filtered = allConvs;
    if (search) {
      filtered = allConvs.filter(c => {
        const inCity = (c.visitor?.city || '').toLowerCase().includes(search);
        const inCountry = (c.visitor?.country || '').toLowerCase().includes(search);
        const inIp = (c.visitor?.ip || '').includes(search);
        const inName = (c.visitor?.name || '').toLowerCase().includes(search);
        const inEmail = (c.visitor?.email || '').toLowerCase().includes(search);
        const inMsgs = (c.messages || []).some(m => (m.content || '').toLowerCase().includes(search));
        return inCity || inCountry || inIp || inName || inEmail || inMsgs;
      });
    }

    const totalCount = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    // Return summaries with latest message snippet
    const summaries = paginated.map(c => {
      const messages = c.messages || [];
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      const lastMsg = messages[messages.length - 1];

      return {
        _id: c._id,
        sessionId: c.sessionId,
        visitor: c.visitor,
        messageCount: messages.length,
        userQueryCount: messages.filter(m => m.role === 'user').length,
        firstActive: c.firstActive,
        lastActive: c.lastActive,
        lastUserQuery: lastUserMsg ? lastUserMsg.content : '',
        lastReplySnippet: lastMsg ? lastMsg.content?.slice(0, 100) : '',
      };
    });

    return send(res, 200, {
      conversations: summaries,
      total: totalCount,
      limit,
      skip
    });
  }

  // 2. DELETE requests
  if (req.method === 'DELETE') {
    if (queryParams.sessionId) {
      const result = await conversations.deleteOne({ sessionId: queryParams.sessionId });
      return send(res, 200, { success: true, deleted: result.deletedCount });
    }

    if (queryParams.all === 'true') {
      if (typeof conversations.deleteMany === 'function') {
        await conversations.deleteMany({});
      }
      return send(res, 200, { success: true, message: 'All conversations cleared' });
    }

    return send(res, 400, { error: 'sessionId query parameter required' });
  }

  return send(res, 405, { error: 'Method not allowed' });
}
