/**
 * Import Router from express and our Body-parser
 */
import { Router } from 'express';
import * as bodyParser from 'body-parser';
import * as seed from '../utilities/db_seeding/';

/**
 * Import Database functions
 */
import { query } from '../db/';

/**
 * Import Utilities
 * @errorFormatter
 * @encryption
 * @tokens
 * @dataValidation
 * @seeding
 */
import { handleServerError } from '../utilities/format/formatHandler';
import { encrypt, compare } from '../utilities/security/encryptionHandler';
import { asignToken, verifyToken, getIdentity } from '../utilities/security/tokenHandler';
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
router.get('/', jsonParser, verifyToken, async function (req, res) {
  try {
    const posts = await query('SELECT * FROM posts', undefined, true);

    res.status(200).send(posts);
  } catch (error) {
    handleServerError(res, error);
  }
});

/**
 * DEBUG SEED POSTS
 */
router.get('/seed', jsonParser, async function (req, res) {
  try {
    const response = await seed.posts.generatePosts(5);

    if (response?.code) {
      res.status(400).send('No posts were found!');
      console.log(response);
    } else {
      res.status(200).send('Seeded Posts!!');
    }
  } catch (error) {
    handleServerError(res, error);
  }
});

export default router;
