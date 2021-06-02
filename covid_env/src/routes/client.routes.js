import { Router } from 'express';
import { home, uploadFile, age, patient } from '../controllers/client.controllers';

const router = Router();

router.get('/', home);
router.get('/upload', uploadFile);
router.get('/graphs/age', age);
router.get('/graphs/patient',  patient)

export default router;
