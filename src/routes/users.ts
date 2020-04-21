/**
 * Import Router from express and our Body-parser
 */
import { Router } from 'express';
import * as bodyParser from 'body-parser';

/**
 * Import Database functions
 */
import { query } from '../db/';

/**
 * Import Utilities
 * @encryption
 * @tokens
 * @errorFormatter
 * @dataValidation
 * @seeding
 */
import { encrypt, compare } from '../utilities/security/encryptionHandler';
import { asignToken, verifyToken, getIdentity } from '../utilities/security/tokenHandler';
import {
  formatQueryError,
  formatDateToSQL,
  formateDateToLocale,
} from '../utilities/format/formatHandler';
import * as request_validation from '../request_validation';
import { JsonWebTokenError } from 'jsonwebtoken';

/**
 * Instanciate Router and Body-parser objects.
 */
const router = Router();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * Manage user routes
 */
router.get('/', jsonParser, verifyToken, async function (req, res) {
  try {
    const _id = await getIdentity(req.body.token);
    res.status(200).send(`Welcome! your id: ${_id}`);
  } catch (error) {
    res.status(400).send('Something went wrong!');
  }
});

router.get('/seed', jsonParser, async function (req, res) {
  try {
    res.status(200).send('seeding successful!');
    console.log('delete create');
  } catch (error) {
    console.log(error);
    res.status(400).send('Oops! Something went wrong!');
  }
});

/**
 *  Register a new user
 */
router.get('/register', jsonParser, async (req: any, res: any) => {
  // VALIDATE RECEIVED DATA
  const { error } = request_validation.user_registration.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // PROCEED WITH REGISTRATION
  try {
    // CHECK IF USER OR EMAIL EXISTS
    const userExists = await query(
      'SELECT FROM users WHERE username = $1 OR email = $2 OR public_name = $3 LIMIT 1',
      [req.body.username, req.body.email, req.body.public_name],
      false,
      true
    );
    console.log(userExists);
    // REJECT USERNAME OR EMAIL
    if (userExists) {
      return res.status(400).send('Username is not available');
    }
    // GENERATE A HASHED UNIQUE ID AND A HASHED PASSWORD
    const hashedId = await encrypt(req.body.username + req.body.email);
    const hashedPassword = await encrypt(req.body.password);
    // CREATE USER INTO DATABASE
    const newUser = await query(
      'INSERT INTO users(_id, username, password, email, public_name) VALUES($1, $2, $3, $4, $5)',
      [hashedId, req.body.username, hashedPassword, req.body.email, req.body.public_name],
      false,
      true
    );
    console.log('Created ', newUser._id, newUser.username);
    res.status(200).send('Created successfully');
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 *
 */
router.get('/login', jsonParser, async (req: any, res: any) => {
  // VALIDATE REQUEST
  const { error } = request_validation.user_login.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // PROCEED WITH LOGIN
  try {
    // CHECK IF USERNAME EXISTS
    const user = await query(
      'SELECT _id, username, password FROM users WHERE username = $1 OR email = $1',
      [req.body.username],
      false,
      true
    );
    // REJECT USERNAME
    if (!user) return res.status(400).send('There was a problem with the username or password');
    // CHECK IF PASSWORD IS CORRECT
    const validPassword = await compare(req.body.password, user.password);
    // REJECT PASSWORD
    if (!validPassword)
      return res.status(400).send('There was a problem, with the username or password');
    // CREATE AND ASIGN TOKEN
    else {
      const token = await asignToken(user._id);
      res.status(200).send(`Welcome ${user._id} \nHere is your Token: ${token}`);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
