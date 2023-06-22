import express from 'express';

import { checkBarcode } from '../controllers/checkBarcodeController';

const router = express.Router();

router.post('/check', checkBarcode)

export default router;