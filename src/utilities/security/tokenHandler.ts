import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { decode } from 'punycode';
const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;

export async function verifyToken(req, res, next) {
  try {
    // VERIFY IF THE REQUEST SENT A TOKEN
    const token = await req.body.token;
    if (!token) return res.status(401).send(' Access Denied ');

    // VERIFY IF THE TOKEN IS VALID
    await jwt.verify(token, TOKEN_SECRET);

    // CONTINUE
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
}

export function asignToken(userId: string) {
  return jwt.sign({ _id: userId }, TOKEN_SECRET, { expiresIn: '1h' });
}

export function getIdentity(token: string) {
  const decoded = jwt.decode(token, { json: true });

  if (decoded) {
    return decoded._id;
  } else {
    console.log('There was an error while decoding a token');
  }
}
