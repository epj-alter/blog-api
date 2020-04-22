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
import * as format from '../utilities/formatHandler/';
import { encrypt, compare } from '../utilities/security/encryptionHandler';
import { asignToken, verifyToken, getIdentity } from '../utilities/security/tokenHandler';
import * as validate from '../utilities/validation';
import { post } from '../utilities/validation';

/**
 * Instanciate Router and Body-parser objects.
 */
const router = Router();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * Manage post routes
 */
/**
 * GET POSTS
 */
router.get('/', jsonParser, verifyToken, async (req, res) => {
  try {
    const posts = await query('SELECT * FROM posts', undefined, true);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

// CREATE POST
router.post('/', jsonParser, verifyToken, async (req, res) => {
  // VALIDATE RECEIVED DATA
  const { error } = validate.post.insert(req.body);
  if (error) {
    return res.status(400).send({ msg: error.details[0].message });
  }
  // PROCEED WITH POST CREATION
  try {
    //CHECK IF DUPLICATE POST
    const post = await query('SELECT FROM posts WHERE title = $1 OR image = $2', [
      req.body.title,
      req.body.image,
    ]);
    if (post) {
      return res.status(400).json({ msg: 'A similar post already exists' });
    }
    // CREATE POST
    const newPost = await query(
      'INSERT INTO posts(user_id, title, image, content) VALUES($1, $2, $3, $4) ',
      [req.body._id, req.body.title, req.body.image, req.body.content]
    );
    //CHECK FOR QUERY ERRORS
    if (newPost?.code) {
      return res.status(400).json({ msg: 'An unexpected error ocurred' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 * DEBUG SEED POSTS
 */
router.get('/seed', jsonParser, async (req, res) => {
  try {
    const posts = await seed.posts.generatePosts(5);

    if (posts?.code) {
      return res.status(400).json({ msg: 'An unexpected error ocurred' });
    } else {
      res.status(200).send('Seeded Posts!!');
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

export default router;