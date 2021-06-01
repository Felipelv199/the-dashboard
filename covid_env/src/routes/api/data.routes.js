import { Router } from 'express';
import {
  uploadFile,
  getDataByAgeRange,
  getData,
  getBySex,
  getDecease,
  getPatients
} from '../../controllers/api/data.controllers';

const router = Router();

router.get('/', getData);
router.post('/file', uploadFile);
router.get('/age', getDataByAgeRange);
router.get('/sex', getBySex);
router.get('/decease', getDecease)
router.get('/patient', getPatients);


export default router;
