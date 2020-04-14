import { Table, Column, POSTGRES_TYPES } from '../';

export class Model {
  private table!: Table;

  // -----------------  CONSTRUCTOR  --------------------------------------------------------------------------- //

  /**
   * @param ssm Specify your connected database instance !important !database connection instance
   * @param name Specify the table name !important !string
   * @param columns Specify the columns of the table !important !object
   */
  constructor(properties: Table) {
    this.table = properties;
  }

  // -----------------  TABLE FUNCTIONS  --------------------------------------------------------------------------- //

  /**
   * Creates a new table into the database
   * @param safe_mode Specify to check if table exists or not
   * @param log Logs the query execution into the console
   */
  createTable(safe_mode?: boolean, log?: boolean) {
    return this.table.ssm.instance.createTable(this.table.name, this.table.columns, safe_mode, log);
  }

  /**
   * Deletes the specified table
   * @param log Logs the query execution into the console
   */
  deleteTable(log?: boolean) {
    return this.table.ssm.instance.deleteTable(this.table.name, log);
  }

  /**
   * Alter table and adds a column
   * @param column : { name: "name", type: "VARCHAR", constraints: ["UNIQUE", "NOT NULL"] }
   * @param log Logs the query execution into the console
   */
  addColumn(column: Column, log: boolean) {
    return this.table.ssm.instance.addColumn(this.table.name, column, log);
  }

  /**
   * @TODO TYPE(48) not working
   * Changes type of the column
   * @param column_name Name of the column to change
   * @param type POSTGRES_TYPES
   * @param log Logs the query execution into the console
   */
  changeColumnType(colum_name: string, type: POSTGRES_TYPES, log: boolean) {
    return this.table.ssm.instance.changeColumnType(this.table.name, colum_name, type, log);
  }

  // -----------------  DATA FUNCTIONS  --------------------------------------------------------------------------- //

  /**
   * Inserts a new row into the database with the specified column values
   * @param columns The columns of the data to insert
   * @param log Logs the query execution into the console
   */
  insertRow(columns: object, log?: boolean) {
    return this.table.ssm.instance.insertRow(this.table.name, columns, log);
  }
  /**
   * Updates a value inside of a specified row of a column
   * @param columns : { _id: 12, username: "Hallo Welt", password: "HAHHAHA" };
   * @param where : { args: [["id", "=", "12"], ["AND"], ["id", ">", "1234"]] }
   * @param log Logs the query execution into the console
   */
  updateColumnValues(columns: object, where: object, log?: boolean) {
    return this.table.ssm.instance.updateColumnValues(this.table.name, columns, where, log);
  }

  /**
   * Deletes all the rows on the table that meet the specified conditions
   * @param where : { args: [["id", "=", "12"], ["AND"], ["id", ">", "1234"]] }
   */
  deleteRows(where: object, log?: boolean) {
    return this.table.ssm.instance.deleteRows(this.table.name, where, log);
  }

  /**
   * @WARNING Deletes all the rows on the table
   */
  deleteAllRows(log?: boolean) {
    return this.table.ssm.instance.deleteAllRows(this.table.name, log);
  }

  /**
   * @TODO NOT SECURE!!! WHERE AND ORDERBY
   * Finds all matching instances
   * @columns : ["id", "username"],
   * @where : { args: [["id", "=", "12"], ["AND"], ["id", ">", "1234"]] }
   * @order_by : { id: "ASC,", username: "DESC" }
   * @param log Logs the query execution into the console
   */
  findAll(columns?: object, where?: object, order_by?: object, log?: boolean) {
    return this.table.ssm.instance.findAll(this.table.name, columns, where, order_by, log);
  }
  /**
   * Finds all matching instances
   * @columns : [ "id", "username" ],
   * @where : { args = [["id", "=", "12"], ["AND"], ["id", ">", "1234"]] }
   * @order_by : { id: "ASC,", username: "DESC" }
   * @param log Logs the query execution into the console
   */
  findOne(columns?: object, where?: object, order_by?: object, log?: boolean) {
    return this.table.ssm.instance.findOne(this.table.name, columns, where, order_by, log);
  }

  // -----------------  QUERY FUNCTIONS  --------------------------------------------------------------------------- //

  /**
   * @param query_string "INSERT INTO table ......"
   * @param query_params req.params.body.....
   * @param log Logs the query execution into the console
   * @param returns Specify if the query returns an object
   */
  executeRawQuery(query_string: string, query_params?: any, log?: boolean, returns?: boolean) {
    return this.table.ssm.instance.query({ query_string, query_params, log }, returns);
  }

  /**
   * @PRIVATE_FUNCTIONS
   */
}
