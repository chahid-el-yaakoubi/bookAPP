import express from 'express';
import { createRegion, updateRegion, getAllRegions, deleteRegion } from '../controllers/cities.js';

const router = express.Router();

router.post('/', createRegion);
router.put('/:id', updateRegion);
router.get('/', getAllRegions);
router.delete('/:id', deleteRegion);

export default router;
