/**
 * Import all routes
 */
import users from './users';
import posts from './posts';
import comments from './comments';
import root from './root';

/**
 * Add routes for the router to use
 * @param app Instance of the App class
 */
export default function routes(app: any) {
  app.use('/', root);
  app.use('/api/user', users);
  app.use('/api/post', posts);
  app.use('/api/comment', comments);
}
