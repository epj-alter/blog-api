/**
 * Import Router from express and our Body-parser
 */
import { Router } from 'express';
import * as bodyParser from 'body-parser';

/**
 * Import Utilities
 * @encryption
 * @tokens
 * @errorFormatter
 * @dataValidation
 */
import { encrypt, compare } from '../utility/security/encryptionHandler';
import { asignToken, verifyToken } from '../utility/security/tokenHandler';
import {
  formatQueryError,
  formatDateToSQL,
  formateDateToLocale
} from '../utility/format/formatHandler';
import { register, login } from '../utility/validation/users/validationHandler';

/**
 * Import Models && operators
 */
import { User } from '../models/';

/**
 * Instanciate Router and Body-parser objects.
 */
const router = Router();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 *
 */
router.get('/', urlencodedParser, async function(req, res) {
  try {
    const user = await User.findAll(undefined, undefined, { nationality: 'ASC' }, true);

    if (user?.code) return res.status(400).send('No users found');
    else if (user) return res.status(200).send(user);
    else return res.status(400).send('No users found!');
  } catch (error) {
    console.log(error);
    res.status(400).send('Oops! Something went wrong!');
  }
});

/**
 *  Register a new user
 */
router.get('/register', urlencodedParser, async (req: any, res: any) => {
  // // VALIDATE RECEIVED DATA
  // const { error } = register.validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  // // PROCEED WITH REGISTRATION
  // try {
  //   // CHECK IF USER EXISTS
  //   const userExists = await User.findOne({
  //     where: {
  //       username: req.body.username
  //     }
  //   });
  //   const emailExists = await User.findOne({
  //     where: {
  //       email: req.body.email
  //     }
  //   });
  //   if (userExists) return res.status(400).send('Username is not available');
  //   if (emailExists) return res.status(400).send('Email is already registered');
  //   // GENERATE A HASHED UNIQUE ID AND A HASHED PASSWORD
  //   const hashedId = await encrypt(req.body.username + req.body.email);
  //   const hashedPassword = await encrypt(req.body.password);
  //   // CREATE USER INTO DATABASE
  //   const newUser = await User.create({
  //     _id: hashedId,
  //     email: req.body.email,
  //     username: req.body.username,
  //     alias: req.body.alias,
  //     password: hashedPassword
  //   });
  //   console.log('Created ', newUser.get('_id'), newUser.get('username'));
  //   res.status(200).send('Created successfully');
  // } catch (error) {
  //   error = queryError(error);
  //   res.status(400).send(error);
  // }
});

/**
 *
 */
router.get('/login', urlencodedParser, async (req: any, res: any) => {
  // // VALIDATE RECEIVED DATA
  // const { error } = login.validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  // // PROCEED WITH LOGIN
  // try {
  //   // CHECK IF USERNAME EXISTS
  //   const user = await User.findOne({
  //     attributes: ['alias', 'password', '_id'],
  //     where: { [Op.or]: [{ username: req.body.username }, { email: req.body.username }] }
  //   });
  //   // REJECT USERNAME
  //   if (!user) return res.status(400).send('username not found');
  //   // CHECK IF PASSWORD IS CORRECT
  //   const validPassword = await compare(req.body.password, user.get('password'));
  //   // REJECT PASSWORD
  //   if (!validPassword) return res.status(400).send('invalid password');
  //   // CREATE AND ASIGN TOKEN
  //   else {
  //     const token = await asignToken(user.get('_id'));
  //     res
  //       .status(200)
  //       .header('auth-token', token)
  //       .send('Welcome ' + user.get('_id') + ' Here is your Token: ' + token);
  //   }
  // } catch (error) {
  //   error = queryError(error);
  //   res.status(400).send(error);
  // }
});

export default router;
