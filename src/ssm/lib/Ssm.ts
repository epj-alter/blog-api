import { Postgres } from '../';

export enum DIALECTS {
  postgres = 'postgres'
}

/**
 * @TODO REFACTOR CHARACTER TYPES
 * @TODO INTRODUCE INTERVAL TYPES
 * @TODO REFACTOR FLOATING TYPES
 * @TODO ADD REST OF TYPES
 */
export enum POSTGRES_TYPES {
  BOOLEAN = 'BOOLEAN',
  CHAR = 'CHAR',
  VARCHAR = 'VARCHAR ',
  TEXT = 'TEXT',
  SMALLINT = 'SMALLINT',
  INT = 'INT',
  BIGINT = 'BIGINT',
  SMALLSERIAL = 'SMALLSERIAL',
  SERIAL = 'SERIAL',
  BIGSERIAL = 'BIGSERIAL',
  NUMERIC = 'NUMERIC',
  NUMERIC_PRECISE = 'NUMERIC(precision)',
  NUMERIC_PRECISE_SCALE = 'NUMERIC(precision scale)',
  FLOAT = 'FLOAT',
  FLOAT4 = 'FLOAT4',
  FLOAT8 = 'FLOAT8',
  DATE = 'DATE',
  TIME = 'TIME',
  TIMESTAMP = 'TIMESTAMP',
  TIMESTAMPTZ = 'TIMESTAMPTZ'
}

/**
 * @TODO Refactor CHECK constraints
 * @TODO Implement EXCLUDE constraints
 */
export enum POSTGRES_CONSTRAINTS {
  CHECK = 'CHECK',
  NOTNULL = 'NOT NULL',
  UNIQUE = 'UNIQUE',
  PRIMARYKEY = 'PRIMARY KEY',
  FOREIGNKEY = 'FOREIGN KEY'
}

export interface Table {
  ssm: SSM;
  name: string;
  columns: object;
}

export interface Column {
  name: string;
  type: POSTGRES_TYPES;
  constraints: POSTGRES_CONSTRAINTS[];
}

export class SSM {
  public instance: any;

  constructor(dialect: string, config: object) {
    switch (dialect) {
      case DIALECTS.postgres:
        this.instance = new Postgres(config);
        break;
      default:
        console.log('Please specify a dialect');
        break;
    }
  }
}
