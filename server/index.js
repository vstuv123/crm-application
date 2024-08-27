import express from 'express';
import dotenv from 'dotenv';
import errorMiddleware from './middleware/error.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connection from './db/connect.js';
import userRouter from './routes/userRoute.js';
import leadRouter from './routes/leadRoute.js';
import opportunityRouter from './routes/opportuinityRoute.js'
import customerRouter from './routes/customerRoute.js';
import salesRouter from './routes/salesRoute.js';
import customerLogRouter from './routes/customerLogRoute.js'
import taskRouter from './routes/taskRoute.js'
import path from 'path';
import { fileURLToPath } from 'url';

process.on("uncaughtException", (err) => {
    console.log(`Error ${err.message}`);
    console.log('Shutting down the server due to uncaught Exception');
    process.exit(1);
})

const app = express();
if (process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config({path: "server/config.env"});
}

const PORT = process.env.PORT || 5000;

const origin = process.env.NODE_ENV === 'PRODUCTION'
  ? process.env.PROD_ORIGIN
  : process.env.DEV_ORIGIN

app.use(cors({
    origin: origin,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api/v1', userRouter);
app.use('/api/v1', leadRouter);
app.use('/api/v1', opportunityRouter);
app.use('/api/v1', customerRouter);
app.use('/api/v1', salesRouter);
app.use('/api/v1', customerLogRouter);
app.use('/api/v1', taskRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

// error middleware
app.use(errorMiddleware);

const server = app.listen(PORT, () => {console.log(`Server successfully running on port ${PORT}`) });

connection();

process.on("unhandledRejection", (err) => {
    console.log(`Error ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');

    server.close(() => {
        process.exit(1);
    })
});