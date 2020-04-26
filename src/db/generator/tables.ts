import { query } from '../index';

class TableSeeder {
  /**
   * @TODO CREATE A PROPER SEEDING SYSTEM
   */
  async renew() {
    try {
      await this.deleteTables();
      await this.createTables();
    } catch (error) {
      return error;
    }
  }

  /**
   * @PrivateFunctions
   */
  private async createTables() {
    try {
      // DEFINE THE QUERY STRINGS
      const createUsersTable =
        'CREATE TABLE users (' +
        '_id VARCHAR NOT NULL, username VARCHAR(58) NOT NULL, password VARCHAR NOT NULL, email VARCHAR NOT NULL, public_name VARCHAR(16) NOT NULL, created timestamp DEFAULT CURRENT_TIMESTAMP,' +
        'PRIMARY KEY (_id),' +
        'UNIQUE (username, email, public_name))';

      const creatUsers_adressTable =
        'CREATE TABLE usersaddress ' +
        '(' +
        'user_id VARCHAR NOT NULL, street VARCHAR(30) NOT NULL, city VARCHAR(30) NOT NULL, state VARCHAR(30) NOT NULL, country VARCHAR(30) NOT NULL, postal SMALLINT NOT NULL,' +
        'PRIMARY KEY (user_id), CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(_id)' +
        ')';

      const createPostsTable =
        'CREATE TABLE posts (' +
        '_id SERIAL, user_id VARCHAR NOT NULL, title VARCHAR(100) NOT NULL, image VARCHAR NOT NULL, content TEXT NOT NULL, created timestamp DEFAULT CURRENT_TIMESTAMP, last_update timestamp DEFAULT CURRENT_TIMESTAMP,' +
        'PRIMARY KEY (_id),' +
        'FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,' +
        'UNIQUE (title, image))';

      const createCommentsTable =
        'CREATE TABLE comments (' +
        '_id SERIAL, user_id VARCHAR NOT NULL, post_id INT NOT NULL, content TEXT NOT NULL, created timestamp DEFAULT CURRENT_TIMESTAMP, last_update timestamp DEFAULT CURRENT_TIMESTAMP,' +
        'PRIMARY KEY (_id),' +
        'FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,' +
        'FOREIGN KEY (post_id) REFERENCES posts(_id) ON DELETE CASCADE)';

      // CREATE TABLE USERS
      const users = await query(createUsersTable, undefined);
      // CHECK IF THE QUERY RETURNED AN ERROR
      if (users?.code) {
        return users;
      }
      // CREATE TABLE USERS_ADDRESS
      const users_address = await query(creatUsers_adressTable, undefined);
      if (users_address?.code) {
        return users_address;
      }
      // CREATE TABLE POSTS
      const posts = await query(createPostsTable, undefined);
      if (posts?.code) {
        return posts;
      }
      // CREATE TABLE COMMENTS
      const comments = await query(createCommentsTable, undefined);
      if (comments?.code) {
        return comments;
      }
    } catch (error) {
      return error;
    }
  }
  private async deleteTables() {
    try {
      // WHEN DROPPING A TABLE, DO IT FROM LOWER TO UPPER IN HIERARCHY CALL

      // DROP TABLE COMMENTS
      const comments = await query('DROP TABLE IF EXISTS comments', undefined);
      // CHECK IF THE QUERY RETURNED AN ERROR
      if (comments?.code) {
        return comments;
      }
      // DROP TABLE POSTS
      const posts = await query('DROP TABLE IF EXISTS posts', undefined);
      if (posts?.code) {
        return posts;
      }
      // DROP TABLE USERS_ADDRESS
      const users_address = await query('DROP TABLE IF EXISTS usersaddress', undefined);
      if (users_address?.code) {
        return users_address;
      }
      // DROP TABLE USERS
      const users = await query('DROP TABLE IF EXISTS users', undefined);
      if (users?.code) {
        return users;
      }
    } catch (error) {
      return error;
    }
  }
}

export const tables = new TableSeeder();
