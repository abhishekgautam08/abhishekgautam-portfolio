import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

// In-memory fallback for local dev when MONGODB_URI is not provided yet
const fallbackStorage = {
  conversations: [],
  admins: []
};

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'portfolio';

  if (!uri) {
    console.warn('[DB] MONGODB_URI is not defined. Using in-memory database fallback for development.');
    return {
      client: null,
      db: null,
      isFallback: true,
      collections: getFallbackCollections()
    };
  }

  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
      isFallback: false,
      collections: {
        conversations: cachedDb.collection('conversations'),
        admins: cachedDb.collection('admins')
      }
    };
  }

  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    const db = client.db(dbName);

    // Create indexes for efficient querying
    try {
      await db.collection('conversations').createIndex({ sessionId: 1 }, { unique: true });
      await db.collection('conversations').createIndex({ lastActive: -1 });
      await db.collection('admins').createIndex({ email: 1 }, { unique: true });
    } catch {
      // Indexes may already exist or user lacks index privileges
    }

    cachedClient = client;
    cachedDb = db;

    console.log('[DB] Successfully connected to MongoDB database:', dbName);

    return {
      client,
      db,
      isFallback: false,
      collections: {
        conversations: db.collection('conversations'),
        admins: db.collection('admins')
      }
    };
  } catch (err) {
    console.error('[DB] MongoDB connection failed:', err.message);
    console.warn('[DB] Falling back to in-memory database to keep server operational.');
    return {
      client: null,
      db: null,
      isFallback: true,
      collections: getFallbackCollections()
    };
  }
}

function getFallbackCollections() {
  return {
    conversations: {
      async findOne(query) {
        if (query.sessionId) {
          return fallbackStorage.conversations.find(c => c.sessionId === query.sessionId) || null;
        }
        if (query._id) {
          return fallbackStorage.conversations.find(c => String(c._id) === String(query._id)) || null;
        }
        return null;
      },
      async updateOne(filter, update, options = {}) {
        let conv = fallbackStorage.conversations.find(c => c.sessionId === filter.sessionId);
        if (!conv && options.upsert) {
          conv = {
            _id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            sessionId: filter.sessionId,
            messages: [],
            ...update.$setOnInsert
          };
          fallbackStorage.conversations.push(conv);
        }
        if (conv) {
          if (update.$set) {
            Object.assign(conv, update.$set);
          }
          if (update.$push && update.$push.messages) {
            if (update.$push.messages.$each) {
              conv.messages.push(...update.$push.messages.$each);
            } else {
              conv.messages.push(update.$push.messages);
            }
          }
          if (update.$inc && update.$inc.messageCount) {
            conv.messageCount = (conv.messageCount || 0) + update.$inc.messageCount;
          }
        }
        return { acknowledged: true, matchedCount: conv ? 1 : 0 };
      },
      find(query = {}) {
        let results = [...fallbackStorage.conversations];
        return {
          sort(sortCriteria) {
            results.sort((a, b) => {
              const aTime = new Date(a.lastActive || 0).getTime();
              const bTime = new Date(b.lastActive || 0).getTime();
              return sortCriteria.lastActive === -1 ? bTime - aTime : aTime - bTime;
            });
            return this;
          },
          skip(n) {
            results = results.slice(n);
            return this;
          },
          limit(n) {
            results = results.slice(0, n);
            return this;
          },
          async toArray() {
            return results;
          }
        };
      },
      async countDocuments() {
        return fallbackStorage.conversations.length;
      },
      async deleteOne(filter) {
        const initialLen = fallbackStorage.conversations.length;
        fallbackStorage.conversations = fallbackStorage.conversations.filter(
          c => c.sessionId !== filter.sessionId && String(c._id) !== String(filter._id)
        );
        return { deletedCount: initialLen - fallbackStorage.conversations.length };
      }
    },
    admins: {
      async findOne(query) {
        if (query.email) {
          return fallbackStorage.admins.find(a => a.email.toLowerCase() === query.email.toLowerCase()) || null;
        }
        if (query.username) {
          return fallbackStorage.admins.find(a => a.username.toLowerCase() === query.username.toLowerCase()) || null;
        }
        return fallbackStorage.admins[0] || null;
      },
      async insertOne(doc) {
        const newAdmin = {
          _id: 'local_adm_' + Date.now(),
          ...doc
        };
        fallbackStorage.admins.push(newAdmin);
        return { acknowledged: true, insertedId: newAdmin._id };
      },
      async countDocuments() {
        return fallbackStorage.admins.length;
      },
      async updateOne(filter, update) {
        const admin = fallbackStorage.admins.find(a => a.email === filter.email || a.username === filter.username);
        if (admin && update.$set) {
          Object.assign(admin, update.$set);
        }
        return { acknowledged: true, matchedCount: admin ? 1 : 0 };
      }
    }
  };
}
