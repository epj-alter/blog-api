import { Model, POSTGRES_TYPES, POSTGRES_CONSTRAINTS } from '../ssm/';
import { ssm } from '../db/index';

export const User = new Model({
  ssm: ssm,
  name: 'users',
  columns: {
    _id: {
      type: POSTGRES_TYPES.VARCHAR,
      constraints: [POSTGRES_CONSTRAINTS.PRIMARYKEY, POSTGRES_CONSTRAINTS.UNIQUE]
    },
    username: {
      type: POSTGRES_TYPES.VARCHAR + '(48)',
      constraints: [POSTGRES_CONSTRAINTS.NOTNULL, POSTGRES_CONSTRAINTS.UNIQUE]
    },
    email: {
      type: POSTGRES_TYPES.VARCHAR,
      constraints: [POSTGRES_CONSTRAINTS.NOTNULL, POSTGRES_CONSTRAINTS.UNIQUE]
    },
    password: {
      type: POSTGRES_TYPES.VARCHAR,
      constraints: [POSTGRES_CONSTRAINTS.NOTNULL]
    },
    alias: {
      type: POSTGRES_TYPES.VARCHAR,
      constraints: [POSTGRES_CONSTRAINTS.NOTNULL, POSTGRES_CONSTRAINTS.UNIQUE]
    },
    birthdate: {
      type: POSTGRES_TYPES.DATE,
      constraints: [POSTGRES_CONSTRAINTS.NOTNULL]
    },
    nationality: {
      type: POSTGRES_TYPES.VARCHAR + '(48)',
      constraints: [POSTGRES_CONSTRAINTS.NOTNULL]
    }
  }
});
