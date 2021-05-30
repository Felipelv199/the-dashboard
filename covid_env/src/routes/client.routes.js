import { Router } from 'express';
import { uploadFile } from '../controllers/client.controllers';

const router = Router();

router.post('/upload', uploadFile);

export default router;
