import { Router } from 'express';
import {
  createDataPiece,
  uploadFile,
  getDataByAgeRange,
} from '../../controllers/api/data.controllers';

const router = Router();

router.post('/', createDataPiece);
router.post('/file', uploadFile);
router.get('/', getDataByAgeRange);

export default router;
