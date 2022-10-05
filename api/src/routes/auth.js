import express from 'express';
import { loginAccessToken } from '../controllers/authorization.js';

const router = express.Router();

router.post('/login', loginAccessToken);

export default router;