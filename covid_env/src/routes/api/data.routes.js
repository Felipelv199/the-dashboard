import { Router } from 'express';
import {
  createDataPiece,
  uploadFile,
} from '../../controllers/api/data.controllers';

const router = Router();

router.post('/', createDataPiece);
router.post('/file', uploadFile);

export default router;
