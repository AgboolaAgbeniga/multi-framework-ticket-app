import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

interface AuthToken {
  token: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

function readDb(): any {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], tickets: [], auth: { tokens: [] } };
  }
}

function writeDb(data: any): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Login API called with method:', req.method);
  console.log('Request body:', req.body);

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  console.log('Attempting login for email:', email);

  const db = readDb();
  console.log('Database users count:', db.users?.length || 0);

  const user = db.users.find((u: User) => u.email === email);

  if (!user) {
    console.log('User not found for email:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log('User found, checking password');
  if (user.password !== password) {
    console.log('Password mismatch for user:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log('Login successful for user:', email);

  // Create auth token
  const token: AuthToken = {
    token: Math.random().toString(36).slice(2) + Date.now().toString(36),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };

  // Store token in db
  if (!db.auth) db.auth = { tokens: [] };
  db.auth.tokens.push(token);
  writeDb(db);

  console.log('Token created and stored for user:', email);
  return res.status(200).json(token);
}