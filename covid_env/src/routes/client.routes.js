import { Router } from 'express';
import { home, uploadFile, age } from '../controllers/client.controllers';

const router = Router();

router.get('/', home);
router.get('/upload', uploadFile);
router.get('/graphs/age', age);

export default router;
