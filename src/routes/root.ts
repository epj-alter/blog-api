import * as express from 'express';
import '../utilities/db_seeding/tables';
import '../utilities/db_seeding/tables';
import * as seed from '../utilities/db_seeding/';

const router = express.Router();

router.get('/', async (req: any, res: any) => {});
router.get('/api/regenerate', async (req, res) => {
  try {
    const response = await seed.tables.regenerateTables();

    if (response?.code) {
      res.status(400).send('something went wrong!');
      console.log(response);
    } else res.status(200).send('Regenerated Tables!');
  } catch (error) {
    res.status(400).send('Oops! something went wrong..');
    console.log(error);
  }
});

export default router;
