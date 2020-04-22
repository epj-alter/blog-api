import { query } from '../../db/index';
import * as faker from 'faker';

class PostSeeder {
  async generatePosts(number_of_posts: number) {
    try {
      for (let index = 0; index < number_of_posts; index++) {
        const post = await query(
          'INSERT INTO posts(user_id, title, image, content) VALUES($1, $2, $3, $4)',
          [
            '$2a$10$Oyf8A1NEJZwPZKewNBqEB./NKYxxBExqWFv9ijm14wfQOeRl0IuHS',
            faker.random.words(),
            'http://picsum.photos/640/480/',
            faker.lorem.paragraphs(),
          ],
          true
        );
        if (post?.code) {
          return post;
        }
      }
    } catch (error) {
      return error;
    }
  }

  async deletePosts() {
    try {
      await query('DELETE FROM posts');
    } catch (error) {
      return error;
    }
  }
}

export const posts = new PostSeeder();
