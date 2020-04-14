import { Pool, PoolConfig } from 'pg';
import { Column, POSTGRES_TYPES, POSTGRES_CONSTRAINTS } from './Ssm';

interface QueryOptions {
  queryString: string;
  queryParams?: string;
  log?: boolean;
}

export class Postgres {
  private pool;

  // -----------------  CONSTRUCTOR  --------------------------------------------------------------------------- //

  /**
   * Creates a connection Pool with the specified configuration
   * @param config USES NODE-POSTGRES ("pg") PoolConfig object
   */
  constructor(config?: PoolConfig) {
    this.pool = new Pool(config);
  }

  /**
   * @TODO refactor query string to use $1 $2 $3 values
   * @TODO check security of queries
   */

  // -----------------  TABLE FUNCTIONS  --------------------------------------------------------------------------- //

  /**
   * Creates a new table into the database
   * @param safe_mode Specify to check if table exists or not
   * @param log Logs the query execution into the console
   */
  createTable(table_name: string, columns: object, safe_mode: boolean, log?: boolean) {
    let safe: string;
    safe_mode ? (safe = 'IF NOT EXISTS ') : (safe = '');

    const queryString =
      'CREATE TABLE ' + safe + table_name + '(' + this.mapColumnsToQeryString(columns) + ')';
    return this.query({ queryString, log }, false);
  }

  /**
   * Deletes a table with the specified name
   * @param table_name Name of table to delete
   * @param log Logs the query execution into the console
   */
  deleteTable(table_name: string, log?: boolean) {
    const queryString = 'DROP TABLE ' + table_name;
    return this.query({ queryString, log }, false);
  }

  /**
   * Alter table and adds a column
   * @param table_name Name of the table to change
   * @param column : { name: "name", type: "VARCHAR", constraints: ["UNIQUE", "NOT NULL"] }
   * @param log Logs the query execution into the console
   */
  addColumn(table_name: string, column: Column, log?: boolean) {
    const queryString =
      'ALTER TABLE ' +
      table_name +
      ' ADD COLUMN ' +
      column.name +
      ' ' +
      column.type +
      ' ' +
      column.constraints.join(' ');
    return this.query({ queryString, log }, false);
  }

  /**
   * @TODO TYPE(48) not working
   * Changes type of the column
   * @param table_name Name of table to change
   * @param column_name Name of column to change
   * @param type POSTGRES_TYPES
   * @param log Logs the query execution into the console
   */
  changeColumnType(table_name: string, column_name: string, type: POSTGRES_TYPES, log?: boolean) {
    const queryString =
      ' ALTER TABLE ' + table_name + ' ALTER COLUMN ' + column_name + ' TYPE ' + type;
    return this.query({ queryString, log }, false);
  }

  // -----------------  DATA FUNCTIONS  --------------------------------------------------------------------------- //

  /**
   * Inserts a new row of values into the database with the specified column values
   * @param table_name The table name
   * @param columns The columns of the data to insert
   * @param log Logs the query execution into the console
   */
  insertRow(table_name: string, columns: object, log?: boolean) {
    const queryString =
      'INSERT INTO ' +
      table_name +
      '(' +
      Object.keys(columns) +
      ')' +
      ' VALUES(' +
      this.mapValuesToQueryString(columns) +
      ')';

    return this.query({ queryString, log }, true);
  }

  /**
   * Updates a value inside of a specified row of a column
   * @param columns : { _id: 12, username: "Hallo Welt", password: "HAHHAHA" };
   * @param where : { args: [["id", "=", "12"], ["AND"], ["id", ">", "1234"]] }
   */
  updateColumnValues(table_name: string, columns: object, where: object, log?: boolean) {
    const queryString =
      'UPDATE ' +
      table_name +
      ' SET ' +
      this.mapColumsToUpdate(columns) +
      ' WHERE ' +
      this.mapWhereOperatorToString(where);
    return this.query({ queryString, log }, true);
  }

  /**
   * Deletes all the rows on the table that meet the specified conditions
   * @param where : { args: [["id", "=", "12"], ["AND"], ["id", ">", "1234"]] }
   */
  deleteRows(table_name: string, where: object, log?: boolean) {
    const queryString =
      'DELETE FROM ' + table_name + ' WHERE ' + this.mapWhereOperatorToString(where);
    return this.query({ queryString, log }, true);
  }

  /**
   * Deletes all the rows on the table
   */
  deleteAllRows(table_name: string, log?: boolean) {
    const queryString = 'DELETE FROM ' + table_name;
    return this.query({ queryString, log }, true);
  }

  /**
   * @TODO IMPROVE SECURITY SOMEHOW
   * @TODO implement LENGTH();
   * @TODO implement ORDER BY
   * Finds all matching instances
   * @param columns : ["id", "username"],
   * @param where : { args: [["id", "=", "12"], ["AND"], ["id", ">", "1234"]] }
   * @param order_by : { args: [["id", "DESC"], ",", ["username", "ASC"]] }
   */
  findAll(table_name: string, columns?: any[], where?: object, order_by?: object, log?: boolean) {
    let columns_string = '*';
    let where_string = '';
    let order_string = '';

    columns ? (columns_string = columns.join(',')) : '*';
    where ? (where_string = ' WHERE ' + this.mapWhereOperatorToString(where)) : '';
    order_by ? (order_string = ' ORDER BY ' + this.mapOrderByToQueryString(order_by)) : '';

    const queryString =
      'SELECT ' + columns_string + ' from ' + table_name + where_string + order_string;

    return this.query({ queryString, log }, true);
  }

  /**
   * @TODO implement LENGTH();
   * @TODO implement ORDER BY
   * Finds all matching instances
   * @param columns : ["id", "username"],
   * @param where : { args: [["id", "=", "12"], ["AND"], ["id", ">", "1234"]] }
   * @param order_by : { args: [["id", "DESC"], ",", ["username", "ASC"]] }
   */
  findOne(table_name: string, columns?: any[], where?: object, order_by?: object, log?: boolean) {
    let columns_string = '*';
    let where_string = '';
    let order_string = '';

    columns ? (columns_string = columns.join(',')) : '*';
    where ? (where_string = ' WHERE ' + this.mapWhereOperatorToString(where)) : '';
    order_by ? (order_string = ' ORDER BY ' + this.mapOrderByToQueryString(order_by)) : '';

    const queryString =
      'SELECT ' + columns_string + ' from ' + table_name + where_string + order_string + ' LIMIT 1';

    return this.query({ queryString, log }, true);
  }

  // -----------------  QUERY FUNCTIONS  --------------------------------------------------------------------------- //

  /**
   * @param options : { "querystring", any?, log? }
   * @param returns Specify if the query returns an object
   */
  async query(options: QueryOptions, returns?: boolean) {
    const start = Date.now();
    try {
      const response = await this.pool.query(options.queryString, options?.queryParams);
      if (options.log) {
        const duration = Date.now() - start;
        console.log('Query Executed: ', {
          text: options.queryString,
          duration,
          rows: response.rowCount
        });
      }
      if (returns && response.rows.length > 0 && response) {
        return response.rows;
      }
    } catch (error) {
      if (options.log) {
        console.log(error.severity + ' ' + error.code + ' OCCURRED');
      }
      return error;
    }
  }

  // -----------------  PRIVATE FUNCTIONS  --------------------------------------------------------------------------- //

  /**
   * @PRIVATE_FUNCTION
   * Maps the values of an object to an array readable for SQL
   * @param columns The object with values in it.
   * @var values The extracted values
   */
  private mapValuesToQueryString(columns: object) {
    return Array.from(Object.values(columns))
      .map(function(values) {
        return "'" + values + "'";
      })
      .join(',');
  }

  /**
   * @PRIVATE_FUNCTION
   * Maps the table to a query string so we can create it
   * @param table The table to create
   */
  private mapColumnsToQeryString(table: object) {
    let column: any = [];
    let columns: any = [];
    for (const column_name in table) {
      if (table.hasOwnProperty(column_name)) {
        column.push(column_name);
        const the_column = Object.values(table[column_name]);

        for (const properties in the_column) {
          if (the_column.hasOwnProperty(properties)) {
            const the_properties: any = the_column[properties];

            if (typeof the_properties === typeof {}) {
              column.push(the_properties.join(' '));
            } else column.push(the_properties);
          }
        }
        columns.push(column.join(' '));
        column = [];
      }
    }
    return columns.join(',');
  }

  /**
   * @PRIVATE_FUNCTION
   * @param whereObject
   */
  private mapWhereOperatorToString(whereObject: object) {
    const args = Object.values(whereObject);
    let querystring: any = [];
    for (let index = 0; index < args[0].length; index++) {
      querystring.push(args[0][index][0]);
      if (args[0][index][2]) {
        querystring.push(args[0][index][1]);
        querystring.push("'" + args[0][index][2] + "'");
      }
    }
    return querystring.join(' ');
  }

  /**
   * @PRIVATE_FUNCTION
   * @param orderbyObject
   */
  private mapOrderByToQueryString(orderbyObject: object) {
    let orderby: any = [];

    for (const column in orderbyObject) {
      if (orderbyObject.hasOwnProperty(column)) {
        const value = orderbyObject[column];
        orderby.push(column + ' ' + value);
      }
    }

    return orderby.join(', ');
  }

  /**
   * @param columnObject
   */
  private mapColumsToUpdate(columnObject: object) {
    let columnsToUpdate: any = [];

    for (const column in columnObject) {
      if (columnObject.hasOwnProperty(column)) {
        const value = columnObject[column];
        columnsToUpdate.push(column + ' = ' + "'" + value + "'");
      }
    }

    return columnsToUpdate.join(', ');
  }
}
