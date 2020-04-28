/**
 * Import Router from express and our Body-parser
 */
import { Router } from 'express';
import * as bodyParser from 'body-parser';
import * as generate from '../db/generator';

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
 * @TODO app access token!
 * GET ALL POSTS
 */
router.get('/', jsonParser, async (req, res) => {
  try {
    // FETCH ALL POSTS
    const posts = await query(
      "SELECT posts._id, posts.title, users.public_name as author, posts.image, CONCAT(LEFT(posts.content, 50), '...') AS preview, posts.created, posts.last_update, COUNT(comments.post_id) AS comments FROM posts LEFT JOIN comments ON comments.post_id = posts._id LEFT JOIN users ON users._id = posts.user_id GROUP BY posts.last_update, posts.title, users.public_name, posts.image, posts.created, posts._id, preview"
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
 * CREATE A POST
 */
router.post('/', jsonParser, security.verifyToken, async (req, res) => {
  // VALIDATE RECEIVED DATA
  const { error } = validate.post.insert(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  // PROCEED WITH POST CREATION
  try {
    // EXTRACT user_id FROM TOKEN
    const user_id = await security.get_idFromToken(req.body.token);
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
      [user_id, req.body.title, req.body.image, req.body.content]
    );
    //CHECK FOR QUERY ERRORS
    if (newPost?.code) {
      return res.status(400).json({ msg: 'An unexpected error ocurred' });
    }
    // RESPOND
    return res.status(200).json('Post created successfully!');
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 * VIEW A POST
 */
router.get('/:post_id', jsonParser, async (req, res) => {
  // VALIDATE RECEIVED DATA
  const { error } = validate.post.select(req.params.post_id);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  // GET POST
  try {
    const post = await query(
      'SELECT posts._id, posts.title, users.public_name as author, posts.image, posts.content, posts.created, COUNT(comments.post_id) AS comments FROM posts LEFT JOIN comments ON comments.post_id = posts._id LEFT JOIN users ON users._id = posts.user_id WHERE posts._id = $1 GROUP BY posts._id, posts.title, users.public_name, posts.image, posts.created, posts.content',
      [req.params.post_id],
      1
    );
    if (!post) {
      return res.status(400).json({
        mesg: 'No posts found with the specified id.',
      });
    }
    if (post?.code) {
      return res.status(400).json({
        msg: 'An unexpected error ocurred',
      });
    }

    let data = {
      post: post,
      comments: [],
    };
    // CHECK IF THE POST HAS COMMENTS
    if (Number(data.post.comments) > 0) {
      // GET COMMENTS
      const comments = await query(
        'SELECT comments._id, comments.content, comments.created, users.public_name AS author FROM comments LEFT JOIN users ON users._id = comments.user_id WHERE comments.post_id = $1',
        [data.post._id]
      );
      if (!comments) {
        return res.status(400).json({
          msg: 'An unexpected error ocurred',
        });
      }
      if (comments?.code) {
        return res.status(400).json({
          msg: 'An unexpected error ocurred',
        });
      } else {
        //ADD THE COMMENTS TO THE DATA
        data.comments = comments;
      }
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 * UPDATE A POST
 */
router.put('/:post_id', jsonParser, security.verifyToken, async (req, res) => {
  // VALIDATE RECEIVED DATA
  let stop1 = validate.post.select(req.params.post_id);
  let stop2 = validate.post.insert(req.body);
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
  // PROCEED WITH POST UPDATE
  try {
    // EXTRACT user_id FROM TOKEN
    const user_id = await security.get_idFromToken(req.body.token);
    // UPDATE POST
    const post = await query(
      'UPDATE posts SET title = $1, image = $2, content = $3 WHERE _id = $4 AND user_id = $5',
      [req.body.title, req.body.image, req.body.content, req.params.post_id, user_id]
    );

    if (!post) {
      return res.status(400).json({
        mesg: 'No posts found with the specified id.',
      });
    }
    if (post?.code) {
      console.log(post);
      return res.status(400).json({
        msg: 'An unexpected error ocurred',
      });
    }
    return res.status(200).send('Post updated');
  } catch (error) {
    return res.status(500).json({
      msg: 'Something went wrong!',
    });
  }
});

/**
 * DELETE A POST
 */
router.delete('/:post_id', jsonParser, security.verifyToken, async (req, res) => {
  // VALIDATE RECEIVED DATA
  let { error } = validate.post.select(req.params.post_id);
  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }
  //PROCEED WITH POST DELETION
  try {
    // EXTRACT user_id FROM TOKEN
    const user_id = await security.get_idFromToken(req.body.token);
    // DELETE POST
    const post = await query('DELETE FROM posts WHERE _id = $1 AND user_id = $2', [
      req.params.post_id,
      user_id,
    ]);
    if (!post) {
      return res.status(400).json({
        mesg: 'No posts found with the specified id.',
      });
    }
    if (post?.code) {
      return res.status(400).json({
        msg: 'An unexpected error ocurred',
      });
    }
    return res.status(200).send('Post Deleted!');
  } catch (error) {
    return res.status(500).json({
      msg: 'Something went wrong!',
    });
  }
});

export default router;
