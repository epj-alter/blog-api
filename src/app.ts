/**
 * Import express so we can handle routing
 */
import express from 'express';

/**
 * Import all the routes from the routes index file
 */
import mountRoutes from './routes';

/**
 * Create App Object, main entry for our program
 * @constructor
 * Instanciates express
 * Sets query parser default behaviour to URLSearchParams,
 * mounts the routes with express instance
 */
class App {
  public express: any;
  private cors: any = require('cors');

  // Constructor
  constructor() {
    // Instanciate express
    this.express = express();
    //ALLOW CORS FOR DEBUG
    this.express.use(this.cors({ origin: 'http://localhost:3000/' }));

    // Set query parser default behaviour to URLSearchParams
    this.express.set('query parser', (queryString: URLSearchParams) => {
      return new URLSearchParams(queryString);
    });
    // Mount the routes with express instance
    mountRoutes(this.express);
  }
}

export default new App().express;
