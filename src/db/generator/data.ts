import { query } from '../index';
import * as faker from 'faker';
import { getRandomInt } from '../../utilities/formatHandler';

class DataGenerator {
  async generateData() {
    const numberOfUsers = await getRandomInt(50, 100);
    const numberOfPosts = await getRandomInt(numberOfUsers, numberOfUsers * 3);
    const numberOfComments = await getRandomInt(numberOfUsers * 2, numberOfPosts * 2);
    try {
      // GENERATE USERS
      for (let index = 0; index <= numberOfUsers; index++) {
        const user = await query(
          'INSERT INTO users(_id, username, password, email, public_name) VALUES($1, $2, $3, $4, $5)',
          [
            faker.finance.bitcoinAddress(),
            faker.internet.userName(),
            faker.internet.password(),
            faker.internet.email(),
            faker.internet.domainWord(),
          ]
        );
        if (user?.code) {
          return user;
        }
      }
      // GENERATE POSTS
      const users = await query('SELECT _id FROM users');
      for (let index = 0; index <= numberOfPosts; index++) {
        const user_id = await getRandomInt(0, users.length - 1);
        const post = await query(
          'INSERT INTO posts(user_id, title, image, content) VALUES($1, $2, $3, $4)',
          [
            users[user_id]._id,
            faker.random.words(),
            'https://i.picsum.photos/id/' + getRandomInt(0, 1050) + '/200/300.jpg',
            faker.lorem.paragraph(),
          ]
        );
        if (post?.code) {
          return post;
        }
      }
      // GENERATE COMMENTS
      const posts = await query('SELECT _id FROM posts');
      for (let i = 0; i <= numberOfComments; i++) {
        const user_id = await getRandomInt(0, users.length - 1);
        const post_id = await getRandomInt(0, posts.length - 1);
        const comment = await query(
          'INSERT INTO comments(user_id, post_id, content) VALUES($1, $2, $3)',
          [users[user_id]._id, posts[post_id]._id, faker.random.words()]
        );
        if (comment?.code) {
          return comment;
        }
      }
    } catch (error) {
      return error;
    }
  }

  async deleteData() {
    try {
      await query('DELETE FROM users');
    } catch (error) {
      return error;
    }
  }
}

export const data = new DataGenerator();
