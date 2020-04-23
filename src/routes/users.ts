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
 * @formatHandler
 * @encryption
 * @tokens
 * @dataValidation
 * @seeding
 */
import * as security from '../utilities/security/';
import * as validate from '../utilities/validation';

/**
 * Instanciate Router and Body-parser objects.
 */
const router = Router();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * Manage user routes
 */
router.get('/', jsonParser, security.verifyToken, async (req, res) => {
  try {
    const _id = await security.get_idFromToken(req.body.token);
    res.status(200).send(`Welcome! your id: ${_id}`);
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 * DEBUG SEED USERS
 */
router.get('/seed', jsonParser, async (req, res) => {
  try {
    res.status(200).send('seeding successful!');
    console.log('delete create');
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 *  Register a new user
 */
router.get('/register', jsonParser, async (req, res) => {
  // VALIDATE RECEIVED DATA
  const { error } = validate.user.registration(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  // PROCEED WITH REGISTRATION
  try {
    // CHECK IF USER OR EMAIL EXISTS
    const userExists = await query(
      'SELECT FROM users WHERE username = $1 OR email = $2 OR public_name = $3 LIMIT 1',
      [req.body.username, req.body.email, req.body.public_name],
      1
    );
    if (userExists) {
      return res.status(400).json({ msg: 'Username not available' });
    }
    // GENERATE A HASHED UNIQUE ID AND A HASHED PASSWORD
    const hashedId = await security.encrypt(req.body.username + req.body.email, true);
    const hashedPassword = await security.encrypt(req.body.password);
    // CREATE USER
    const newUser = await query(
      'INSERT INTO users(_id, username, password, email, public_name) VALUES($1, $2, $3, $4, $5)',
      [hashedId, req.body.username, hashedPassword, req.body.email, req.body.public_name]
    );
    // CHECK FOR ERRORS IN THE QUERY
    if (newUser == undefined || newUser?.code) {
      return res.status(500).json({ msg: 'Something went wrong!' });
    }
    // SEND RESPONSE BACK TO CLIENT
    res.status(200).send('Registration successful');
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 *
 */
router.get('/login', jsonParser, async (req, res) => {
  // VALIDATE REQUEST
  const { error } = validate.user.login(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  // PROCEED WITH LOGIN
  try {
    // CHECK USER IN DATABASE
    const user = await query(
      'SELECT _id, username, password FROM users WHERE username = $1 OR email = $1 LIMIT 1',
      [req.body.username],
      1
    );
    // REJECT USERNAME
    if (!user || user == undefined) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }
    // CHECK IF PASSWORD IS CORRECT
    const validPassword = await security.compare(req.body.password, user.password);
    // REJECT PASSWORD
    if (!validPassword) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }
    // CREATE AND ASIGN TOKEN
    else {
      const token = await security.asignToken(user._id);
      res.status(200).send({ msg: `Welcome ${user._id} \nHere is your Token: ${token}` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

export default router;
