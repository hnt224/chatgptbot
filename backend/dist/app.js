import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config();
const app = express();
//define middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
//middleware for using cookies
app.use(cookieParser(process.env.COOKIE_SECRET));
//remove it in production
app.use(morgan('dev'));
//generate  middleware
app.use("/api/v1", appRouter);
export default app;
//# sourceMappingURL=app.js.map