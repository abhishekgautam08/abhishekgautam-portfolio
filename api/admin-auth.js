import { connectToDatabase } from './lib/db.js';
import { signToken, verifyToken, hashPassword, comparePassword, extractBearerToken } from './lib/auth.js';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const { collections } = await connectToDatabase();
  const { admins } = collections;

  // 1. GET requests
  if (req.method === 'GET') {
    const query = parseQueryParams(req.url);

    // Public check: Does an admin exist yet?
    if (query.check === 'status') {
      const adminCount = await admins.countDocuments();
      return send(res, 200, {
        hasAdmin: adminCount > 0,
        registrationAllowed: adminCount === 0
      });
    }

    // Authenticated verify token
    const token = extractBearerToken(req);
    if (!token) {
      return send(res, 401, { error: 'No authorization token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return send(res, 401, { error: 'Invalid or expired token' });
    }

    const admin = await admins.findOne({ email: decoded.email });
    if (!admin) {
      return send(res, 404, { error: 'Admin account not found' });
    }

    return send(res, 200, {
      authenticated: true,
      user: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt
      }
    });
  }

  // 2. POST requests
  if (req.method === 'POST') {
    const body = req.body || {};
    const action = body.action || 'login';

    // REGISTRATION (Limit to ONLY ONE ADMIN)
    if (action === 'register') {
      const adminCount = await admins.countDocuments();
      if (adminCount >= 1) {
        return send(res, 403, {
          error: 'An admin is already registered. Only one admin is allowed on this portfolio.'
        });
      }

      const { username, email, password } = body;
      if (!username || username.trim().length < 2) {
        return send(res, 400, { error: 'Username must be at least 2 characters' });
      }
      if (!email || !email.includes('@')) {
        return send(res, 400, { error: 'Valid email address is required' });
      }
      if (!password || password.length < 6) {
        return send(res, 400, { error: 'Password must be at least 6 characters' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const cleanUsername = username.trim();

      const hashedPassword = await hashPassword(password);
      const newAdmin = {
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        role: 'superadmin',
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      const result = await admins.insertOne(newAdmin);

      const token = signToken({
        id: result.insertedId || newAdmin._id,
        email: cleanEmail,
        username: cleanUsername,
        role: 'superadmin'
      });

      return send(res, 201, {
        success: true,
        message: 'Admin account registered successfully',
        token,
        user: {
          username: cleanUsername,
          email: cleanEmail,
          role: 'superadmin'
        }
      });
    }

    // LOGIN
    if (action === 'login') {
      const { emailOrUsername, password } = body;
      if (!emailOrUsername || !password) {
        return send(res, 400, { error: 'Username/Email and password are required' });
      }

      const cleanInput = emailOrUsername.trim();

      // Find admin in MongoDB
      const admin = await admins.findOne({
        $or: [
          { email: cleanInput.toLowerCase() },
          { username: cleanInput }
        ]
      });

      if (!admin) {
        return send(res, 401, { error: 'Invalid credentials. Account not found.' });
      }

      const isValidPassword = await comparePassword(password, admin.password);
      if (!isValidPassword) {
        return send(res, 401, { error: 'Invalid password. Please try again.' });
      }

      // Update last login
      try {
        await admins.updateOne(
          { email: admin.email },
          { $set: { lastLoginAt: new Date() } }
        );
      } catch {
        // non-blocking
      }

      const token = signToken({
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role || 'superadmin'
      });

      return send(res, 200, {
        success: true,
        token,
        user: {
          username: admin.username,
          email: admin.email,
          role: admin.role || 'superadmin'
        }
      });
    }

    // CHANGE PASSWORD
    if (action === 'change-password') {
      const token = extractBearerToken(req);
      const decoded = verifyToken(token);
      if (!decoded) {
        return send(res, 401, { error: 'Unauthorized' });
      }

      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword || newPassword.length < 6) {
        return send(res, 400, { error: 'New password must be at least 6 characters' });
      }

      const admin = await admins.findOne({ email: decoded.email });
      if (!admin) {
        return send(res, 404, { error: 'Admin account not found' });
      }

      const isMatch = await comparePassword(currentPassword, admin.password);
      if (!isMatch) {
        return send(res, 400, { error: 'Current password does not match' });
      }

      const hashedPassword = await hashPassword(newPassword);
      await admins.updateOne(
        { email: decoded.email },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );

      return send(res, 200, { success: true, message: 'Password updated successfully' });
    }

    return send(res, 400, { error: 'Invalid action' });
  }

  return send(res, 405, { error: 'Method not allowed' });
}
