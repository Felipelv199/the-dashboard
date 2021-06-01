import { Router } from 'express';
import {
  uploadFile,
  getDataByAgeRange,
  getData,
} from '../../controllers/api/data.controllers';

const router = Router();

router.get('/', getData);
router.post('/file', uploadFile);
router.get('/age', getDataByAgeRange);

export default router;
