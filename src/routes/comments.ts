/**
 * Import Router from express and our Body-parser
 */
import { Router } from 'express';
import * as bodyParser from 'body-parser';

/**
 * Import Database functions
 */
import { query } from '../db';

/**
 * Import Utilities
 * @errorFormatter
 * @security
 * @dataValidation
 * @seeding
 */
import * as security from '../utilities/security';
import * as validate from '../utilities/validation';

/**
 * Instanciate Router and Body-parser objects.
 */
const router = Router();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// ----------------- ROUTES ----------------- //

/**
 * @TODO this should be our search query
 * GET ALL COMMENTS
 */
router.get('/', jsonParser, security.verifyToken, async (req, res) => {
  try {
    // FETCH ALL COMMENTS
    const posts = await query(
      "SELECT posts.title, users.public_name as author, posts.image, CONCAT(LEFT(posts.content, 50), '...') AS preview, posts.created, COUNT(comments.post_id) AS comments FROM posts LEFT JOIN comments ON comments.post_id = posts._id LEFT JOIN users ON users._id = posts.user_id GROUP BY posts.title, users.public_name, posts.image, posts.created, preview"
    );
    if (!posts) {
      return res.status(400).json({ msg: 'No posts found.' });
    }
    if (posts?.code) {
      return res.status(400).json({ msg: 'An unexpected error ocurred' });
    }
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 * CREATE A COMMENT
 */
router.post('/', jsonParser, security.verifyToken, async (req, res) => {
  // VALIDATE REQUEST DATA
  const { error } = validate.comment.insert(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    // EXTRACT user_id FROM TOKEN
    const user_id = await security.get_idFromToken(req.body.token);
    // CREATE COMMENT
    const comment = await query(
      'INSERT INTO comments(user_id, post_id, content) VALUES($1, $2, $3)',
      [user_id, req.body.post_id, req.body.content]
    );
    if (comment?.code) {
      return res.status(400).json({ msg: 'An unexpected error ocurred' });
    }
    // RESPOND
    return res.status(200).json('Comment creation successful!');
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 * SHOW A COMMENT
 */
router.get('/:comment_id', jsonParser, security.verifyToken, async (req, res) => {
  // VALIDATE RECEIVED DATA
  const { error } = validate.comment.select(req.params.comment_id);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const comment = await query(
      'SELECT comments._id, users.public_name AS author, comments.content, comments.created, comments.post_id FROM comments LEFT JOIN users ON users._id = comments.user_id WHERE comments._id = $1',
      [req.params.comment_id]
    );
    if (!comment) {
      return res.status(400).json({ msg: 'no comments with the specified id found' });
    }
    if (comment?.code) {
      return res.status(400).json({ msg: 'An unexpected error ocurred' });
    }
    return res.status(200).send(comment);
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 * UPDATE COMMENT
 */
router.put('/:comment_id', jsonParser, security.verifyToken, async (req, res) => {
  // VALIDATE RECEIVED DATA
  let stop1 = validate.comment.select(req.params.comment_id);
  let stop2 = validate.comment.insert(req.body);
  if (stop1.error) {
    return res.status(400).json({
      msg: stop1.error.details[0].message,
    });
  }
  if (stop2.error) {
    return res.status(400).json({
      msg: stop2.error.details[0].message,
    });
  }
  // PROCEED WITH COMMENT UPDATE
  try {
    // EXTRACT user_id FROM TOKEN
    const user_id = await security.get_idFromToken(req.body.token);
    // UPDATE COMMENT
    const comment = await query(
      'UPDATE comments SET content = $1 WHERE _id = $2 AND user_id = $3',
      [req.body.content, req.params.comment_id, user_id]
    );
    if (!comment) {
      return res.status(400).json({
        mesg: 'No comment found with the specified id or user.',
      });
    }
    if (comment?.code) {
      return res.status(400).json({ msg: 'An unexpected error ocurred' });
    }
    res.status(200).send('Comment updated!');
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 * DELETE COMMENT
 */
router.delete('/:comment_id', jsonParser, security.verifyToken, async (req, res) => {
  // VALIDATE RECEIVED DATA
  let { error } = validate.comment.select(req.params.post_id);
  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }
  // PROCEED COMMENT DELETION
  try {
    // EXTRACT user_id from token
    const user_id = await security.get_idFromToken(req.body.token);
    // DELETE COMMENT
    const comment = await query('DELETE FROM comments WHERE _id = $1 AND user_id = $2', [
      req.params.comment_id,
      user_id,
    ]);
    if (!comment) {
      return res.status(400).json({
        mesg: 'No comments found with the specified id or user.',
      });
    }
    if (comment?.error) {
      return res.status(400).json({
        msg: 'An unexpected error ocurred',
      });
    }
    return res.status(200).send('Comment deleted!');
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

export default router;
