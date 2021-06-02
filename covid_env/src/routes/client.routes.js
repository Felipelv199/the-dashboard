import { Router } from 'express';
import { home, uploadFile } from '../controllers/client.controllers';

const router = Router();

router.get('/', home);
router.get('/upload', uploadFile);

export default router;
