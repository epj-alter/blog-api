import { Model } from '../../ssm/';
import * as faker from 'faker';
import { formatDateToSQL } from '../format/formatHandler';

/**
 * @TODO CREATE A PROPER SEEDING SYSTEM
 */
export async function populateFromScratch(table: Model, count: number) {
  try {
    await table.deleteTable();
    await table.createTable();
    for (let i = 0; i < count; i++) {
      await table.insertRow({
        _id: faker.internet.password(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        alias: faker.random.word(),
        birthdate: formatDateToSQL(faker.date.past(14)),
        nationality: faker.address.country()
      });
    }
  } catch (error) {
    console.log(error);
  }
}
