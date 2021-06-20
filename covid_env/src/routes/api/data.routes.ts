import { Router } from 'express';
import {
  uploadFile,
  getDataByAgeRange,
  getData,
  getBySex,
  getDecease,
  getPatients,
  getPatientsHospitalizedIntubated,
} from '../../controllers/api/data.controllers';

const router = Router();

router.get('/', getData);
router.post('/file', uploadFile);
router.get('/age', getDataByAgeRange);
router.get('/sex', getBySex);
router.get('/decease', getDecease);
router.get('/patient', getPatients);
router.get('/hospitalized', getPatientsHospitalizedIntubated);

export default router;
