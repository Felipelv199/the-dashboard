import { Router } from 'express';
import {
  home,
  uploadFile,
  age,
  patient,
  decease,
  graphs,
  hospitalized,
} from '../controllers/client.controllers';

const router = Router();

router.get('/', home);
router.get('/upload', uploadFile);
router.get('/graphs', graphs);
router.get('/graphs/age', age);
router.get('/graphs/patient', patient);
router.get('/graphs/decease', decease);
router.get('/graphs/hospitalized', hospitalized);

export default router;
