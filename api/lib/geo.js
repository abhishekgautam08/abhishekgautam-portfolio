export function extractVisitorMetadata(req, clientInfo = {}) {
  const headers = req.headers || {};

  // Extract client IP address
  const forwardedFor = headers['x-forwarded-for'] || headers['x-real-ip'] || req.socket?.remoteAddress || '';
  const ip = forwardedFor.split(',')[0].trim() || '127.0.0.1';

  const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');

  // Vercel Geolocation Headers
  const countryCode = headers['x-vercel-ip-country'] || (isLocal ? 'DEV' : (clientInfo.countryCode || 'Unknown'));
  const country = headers['x-vercel-ip-country-name'] || headers['x-vercel-ip-country'] || (isLocal ? 'Localhost (Dev)' : (clientInfo.country || 'Unknown'));
  const region = headers['x-vercel-ip-country-region'] || (isLocal ? 'Local Machine' : (clientInfo.region || ''));
  const city = headers['x-vercel-ip-city'] ? decodeURIComponent(headers['x-vercel-ip-city']) : (isLocal ? 'Development Environment' : (clientInfo.city || 'Unknown'));
  const latitude = headers['x-vercel-ip-latitude'] ? parseFloat(headers['x-vercel-ip-latitude']) : (clientInfo.latitude || null);
  const longitude = headers['x-vercel-ip-longitude'] ? parseFloat(headers['x-vercel-ip-longitude']) : (clientInfo.longitude || null);
  const timezone = headers['x-vercel-ip-timezone'] || clientInfo.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  // Device & User Agent details
  const userAgent = headers['user-agent'] || clientInfo.userAgent || '';
  const parsedAgent = parseUserAgent(userAgent);

  return {
    ip,
    country,
    countryCode,
    region,
    city,
    latitude,
    longitude,
    timezone,
    browser: clientInfo.browser || parsedAgent.browser,
    os: clientInfo.os || parsedAgent.os,
    device: clientInfo.device || parsedAgent.device,
    screenResolution: clientInfo.screenResolution || 'Unknown',
    referrer: clientInfo.referrer || headers.referer || 'Direct',
    language: headers['accept-language']?.split(',')[0] || clientInfo.language || 'en'
  };
}

function parseUserAgent(ua) {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let device = 'Desktop';

  if (!ua) return { browser, os, device };

  if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device = 'Mobile';
  } else if (/iPad|Tablet/i.test(ua)) {
    device = 'Tablet';
  }

  // OS detection
  if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser detection
  if (/Edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome\//i.test(ua) && !/Chromium|Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Opera|OPR\//i.test(ua)) browser = 'Opera';

  return { browser, os, device };
}
