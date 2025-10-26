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
  console.log('Users API called:', req.method, req.url);

  if (req.method === 'GET') {
    // Handle user queries (e.g., login check)
    const { email } = req.query;
    console.log('GET request with email:', email);

    if (email) {
      try {
        const db = readDb();
        console.log('Database read successful, users count:', db.users.length);
        const user = db.users.find((u: User) => u.email === email);
        if (user) {
          console.log('User found:', user.email);
          // Return user without password
          const { password, ...userWithoutPassword } = user;
          return res.status(200).json([userWithoutPassword]);
        }
        console.log('User not found for email:', email);
        return res.status(200).json([]);
      } catch (error) {
        console.error('Error reading database:', error);
        return res.status(500).json({ error: 'Database error' });
      }
    }

    return res.status(400).json({ error: 'Invalid query' });
  }

  if (req.method === 'POST') {
    // Handle user registration
    console.log('POST request body:', req.body);
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const db = readDb();
      console.log('Database read successful for registration');

      // Check if user already exists
      const existingUser = db.users.find((u: User) => u.email === email);
      if (existingUser) {
        console.log('User already exists:', email);
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
      console.log('User created successfully:', newUser.email);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error during user registration:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}