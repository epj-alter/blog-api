import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import * as validate from '../validation';
const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;

export async function verifyToken(req, res, next) {
  try {
    // VALIDATE TOKEN CONTENT
    const token = await req.body.token;
    // VERIFY IF THE TOKEN IS NOT EMPTY
    if (!token) {
      return res.status(401).send(' Access Denied ');
    }
    // VERIFY IF TOKEN IS A VALID TOKEN OBJECT
    const { error } = validate.token.content(token);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }
    // VERIFY JWT TOKEN
    await jwt.verify(token, TOKEN_SECRET);
    // CONTINUE
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
}

export function asignToken(userId: string) {
  return jwt.sign({ _id: userId }, TOKEN_SECRET, { expiresIn: '24h' });
}

export function get_idFromToken(token: string) {
  const decoded = jwt.decode(token, { json: true });

  if (decoded) {
    return decoded._id;
  } else {
    console.log('There was an error while decoding a token');
  }
}
