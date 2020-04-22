import * as express from 'express';
import '../utilities/db_seeding/tables';
import '../utilities/db_seeding/tables';
import * as seed from '../utilities/db_seeding/';

const router = express.Router();

router.get('/', async (req, res) => {});
router.get('/api/regenerate', async (req, res) => {
  try {
    const response = await seed.tables.regenerateTables();

    if (response?.code) {
      console.log(response);
      return res.status(500).json({ msg: 'Something went wrong!' });
    }
    return res.status(200).json({ msg: 'Regenerated Tables!' });
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

export default router;
