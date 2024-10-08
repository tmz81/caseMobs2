import express from 'express';
import recommendationRoutes from './routes/recommendationRoutes';
import { logger } from './middlewares/logger';

const app = express();

app.use(express.json());

app.use(logger);

app.use(recommendationRoutes);

export default app;
