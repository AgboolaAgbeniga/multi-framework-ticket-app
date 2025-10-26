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
  if (req.method === 'GET') {
    // Handle user queries (e.g., login check)
    const { email } = req.query;

    if (email) {
      const db = readDb();
      const user = db.users.find((u: User) => u.email === email);
      if (user) {
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json([userWithoutPassword]);
      }
      return res.status(200).json([]);
    }

    return res.status(400).json({ error: 'Invalid query' });
  }

  if (req.method === 'POST') {
    // Handle user registration
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = readDb();

    // Check if user already exists
    const existingUser = db.users.find((u: User) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
    };

    db.users.push(newUser);
    writeDb(db);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}