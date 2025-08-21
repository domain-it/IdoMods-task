import express from 'express';
import { connectToDatabase } from './config/database.js';
import { LogInfo } from './utils/color-log.js';
import cron from 'node-cron';
import ordersRouter from './routes/order.js';
import authRouter from './routes/auth.js';
import { periodicFetchAndSync } from './controllers/order.js';
import cookieParser from 'cookie-parser';
import { authVerify } from './middleware/auth.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' with { type: 'json' };

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const cronExpression = process.env.FETCH_CRON || '*/5 * * * *';

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use(authVerify);
app.use('/orders', ordersRouter);

connectToDatabase().then();
periodicFetchAndSync().then();

cron.schedule(cronExpression, () => {
  periodicFetchAndSync().then();
  LogInfo('Service', `Cron job triggered: ${cronExpression}`);
});

app.listen(process.env.PORT || 3000, () => {
  LogInfo('Express', `Express server started on port ${process.env.PORT}`);
});
