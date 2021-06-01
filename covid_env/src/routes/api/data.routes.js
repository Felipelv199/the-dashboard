import { Router } from 'express';
import {
  createDataPiece,
  uploadFile,
  getDataByAgeRange,
  getBySex,
  getDecease
} from '../../controllers/api/data.controllers';

const router = Router();

router.post('/', createDataPiece);
router.post('/file', uploadFile);
router.get('/', getDataByAgeRange);
router.get('/sex', getBySex);
router.get('/decease', getDecease)

export default router;
