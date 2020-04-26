import * as express from 'express';
import '../db/generator/tables';
import '../db/generator/tables';
import * as generate from '../db/generator';

const router = express.Router();

router.get('/', async (req, res) => {});
router.get('/api/regenerate', async (req, res) => {
  try {
    const tables = await generate.tables.renew();
    if (tables?.code) {
      console.log(tables);
      return res.status(500).json({ msg: 'Something went wrong!' });
    }
    const data = await generate.data.generateData();
    if (data?.code) {
      console.log(data);
      return res.status(500).json({ msg: 'Something went wrong!' });
    }
    return res.status(200).json({ msg: 'Regenerated database!' });
  } catch (error) {
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

export default router;
