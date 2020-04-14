import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;

export async function verifyToken(req, res, next) {
  try {
    const token = await req.header('auth-token');
    if (!token) return res.status(401).send(' Access Denied ');

    await jwt.verify(token, TOKEN_SECRET);
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
}

export function asignToken(userId: string) {
  return jwt.sign({ _id: userId }, TOKEN_SECRET, { expiresIn: '1h' });
}
