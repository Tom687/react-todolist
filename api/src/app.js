import express from 'express';
import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import globalErrorHandler from './middlewares/errorHandler.js';
import deserializeUser from './middlewares/deserializeUser.js';
import dotenv from 'dotenv';

import todosRoutes from './routes/todos.js';
import authRoutes from './routes/auth.js';

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
	cors({
		credentials: true,
		origin: config.get('origin')
	})
);

app.use(deserializeUser);

app.use('/auth', authRoutes);
app.use('/todos', todosRoutes);

app.use(globalErrorHandler);

export default app;